import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SendContactRequestDto, GetContactsQueryDto } from './dto/contacts.dto';
import { ContactStatus } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async sendContactRequest(userId: string, dto: SendContactRequestDto) {
    const { phone, message } = dto;
    
    // Check if user is trying to add themselves
    const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (currentUser.phone === phone) {
      throw new BadRequestException('Cannot add yourself as a contact');
    }
    
    // Check if request already exists
    const existingRequest = await this.prisma.contactRequest.findUnique({
      where: {
        fromId_toPhone: {
          fromId: userId,
          toPhone: phone,
        },
      },
    });
    
    if (existingRequest && existingRequest.status === ContactStatus.PENDING) {
      throw new BadRequestException('Contact request already sent');
    }
    
    // Find user by phone
    const toUser = await this.prisma.user.findUnique({ where: { phone } });
    
    // Create contact request
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry
    
    const request = await this.prisma.contactRequest.create({
      data: {
        fromId: userId,
        toPhone: phone,
        toUserId: toUser?.id,
        message,
        expiresAt,
        status: ContactStatus.PENDING,
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    
    if (toUser) {
      // User exists - send in-app notification
      await this.createNotification(toUser.id, userId, request.id);
    } else {
      // User doesn't exist - send SMS invite
      await this.sendSmsInvite(phone, currentUser.name);
    }
    
    return {
      requestId: request.id,
      status: request.status,
      userExists: !!toUser,
    };
  }

  async getContacts(userId: string, query: GetContactsQueryDto) {
    const { search, limit = 50, offset = 0 } = query;
    
    const where = {
      OR: [
        { userId, contact: { isBlocked: false } },
        { contactId: userId, user: { isBlocked: false } },
      ],
      ...(search && {
        OR: [
          { contact: { name: { contains: search, mode: 'insensitive' as const } } },
          { user: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };
    
    const contacts = await this.prisma.contact.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            phone: true,
          },
        },
        contact: {
          select: {
            id: true,
            name: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });
    
    // Format response to show the other person in the contact relationship
    const formattedContacts = contacts.map(c => {
      const isUser = c.userId === userId;
      const contactUser = isUser ? c.contact : c.user;
      return {
        id: c.id,
        ...contactUser,
        isFavorite: c.isFavorite,
        createdAt: c.createdAt,
      };
    });
    
    return {
      contacts: formattedContacts,
      count: formattedContacts.length,
    };
  }

  async getSentRequests(userId: string) {
    const requests = await this.prisma.contactRequest.findMany({
      where: {
        fromId: userId,
        status: ContactStatus.PENDING,
      },
      include: {
        toUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      requests: requests.map(r => ({
        id: r.id,
        phone: r.toPhone,
        name: r.toUser?.name,
        avatar: r.toUser?.avatar,
        message: r.message,
        sentAt: r.createdAt,
        userExists: !!r.toUserId,
      })),
    };
  }

  async getReceivedRequests(userId: string) {
    const requests = await this.prisma.contactRequest.findMany({
      where: {
        toUserId: userId,
        status: ContactStatus.PENDING,
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      invitations: requests.map(r => ({
        id: r.id,
        from: r.from,
        message: r.message,
        receivedAt: r.createdAt,
      })),
    };
  }

  async approveRequest(userId: string, requestId: string) {
    const request = await this.prisma.contactRequest.findUnique({
      where: { id: requestId },
    });
    
    if (!request) {
      throw new NotFoundException('Contact request not found');
    }
    
    if (request.toUserId !== userId) {
      throw new ForbiddenException('You can only approve requests sent to you');
    }
    
    if (request.status !== ContactStatus.PENDING) {
      throw new BadRequestException('Request is no longer pending');
    }
    
    // Update request status
    await this.prisma.contactRequest.update({
      where: { id: requestId },
      data: {
        status: ContactStatus.APPROVED,
        respondedAt: new Date(),
      },
    });
    
    // Create bidirectional contact relationship
    const contact = await this.prisma.contact.create({
      data: {
        userId: request.fromId,
        contactId: userId,
      },
      include: {
        user: true,
        contact: true,
      },
    });
    
    // Send approval notification to requester
    await this.createNotification(request.fromId, userId, requestId, 'APPROVED');
    
    return {
      success: true,
      contact,
    };
  }

  async declineRequest(userId: string, requestId: string) {
    const request = await this.prisma.contactRequest.findUnique({
      where: { id: requestId },
    });
    
    if (!request) {
      throw new NotFoundException('Contact request not found');
    }
    
    if (request.toUserId !== userId) {
      throw new ForbiddenException('You can only decline requests sent to you');
    }
    
    await this.prisma.contactRequest.update({
      where: { id: requestId },
      data: {
        status: ContactStatus.DECLINED,
        respondedAt: new Date(),
      },
    });
    
    // Optionally notify requester
    await this.createNotification(request.fromId, userId, requestId, 'DECLINED');
    
    return { success: true };
  }

  async cancelRequest(userId: string, requestId: string) {
    const request = await this.prisma.contactRequest.findUnique({
      where: { id: requestId },
    });
    
    if (!request) {
      throw new NotFoundException('Contact request not found');
    }
    
    if (request.fromId !== userId) {
      throw new ForbiddenException('You can only cancel requests you sent');
    }
    
    await this.prisma.contactRequest.delete({
      where: { id: requestId },
    });
    
    return { success: true };
  }

  async removeContact(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        OR: [
          { id: contactId, userId },
          { id: contactId, contactId: userId },
        ],
      },
    });
    
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    
    await this.prisma.contact.delete({
      where: { id: contactId },
    });
    
    return { success: true };
  }

  async blockContact(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        OR: [
          { id: contactId, userId },
          { id: contactId, contactId: userId },
        ],
      },
    });
    
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    
    await this.prisma.contact.update({
      where: { id: contactId },
      data: { isBlocked: true },
    });
    
    return { success: true };
  }

  private async createNotification(
    userId: string,
    fromUserId: string,
    requestId: string,
    type: 'REQUEST' | 'APPROVED' | 'DECLINED' = 'REQUEST',
  ) {
    const from = await this.prisma.user.findUnique({
      where: { id: fromUserId },
      select: { name: true },
    });
    
    const messages = {
      REQUEST: {
        title: 'New Contact Request',
        message: `${from.name} wants to add you as a contact`,
      },
      APPROVED: {
        title: 'Contact Request Approved',
        message: `${from.name} accepted your contact request`,
      },
      DECLINED: {
        title: 'Contact Request Declined',
        message: `${from.name} declined your contact request`,
      },
    };
    
    await this.prisma.notification.create({
      data: {
        userId,
        type: type === 'REQUEST' ? 'CONTACT_REQUEST' : type === 'APPROVED' ? 'CONTACT_APPROVED' : 'CONTACT_DECLINED',
        title: messages[type].title,
        message: messages[type].message,
        requestId,
        fromUserId,
      },
    });
    
    // Also cache in Redis for real-time delivery
    await this.redis.publish('notifications', JSON.stringify({
      userId,
      type: 'CONTACT_NOTIFICATION',
      data: messages[type],
    }));
  }

  private async sendSmsInvite(phone: string, inviterName: string) {
    // TODO: Integrate with Twilio
    const message = `Hey! ${inviterName} invited you to YouBet, the sports betting community. Tap here to join: https://youbet.app/invite/${phone}`;
    console.log(`SMS to ${phone}: ${message}`);
  }
}

