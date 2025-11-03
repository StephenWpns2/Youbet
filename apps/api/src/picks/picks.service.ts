import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PickType, PickStatus } from '@youbet/database';

@Injectable()
export class PicksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pick.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            handle: true,
            name: true,
            avatarUrl: true,
            roi30d: true,
          },
        },
        event: {
          select: {
            sport: true,
            league: true,
            homeTeam: true,
            awayTeam: true,
            startTime: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.pick.findUnique({
      where: { id },
      include: {
        user: true,
        event: true,
        reactions: {
          include: {
            user: {
              select: {
                handle: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                handle: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.pick.create({
      data: {
        ...data,
        type: PickType.PREDICTION,
        status: PickStatus.PENDING,
      },
    });
  }
}

