import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  SendContactRequestDto,
  ApproveContactRequestDto,
  GetContactsQueryDto,
} from './dto/contacts.dto';

@ApiTags('contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send contact request by phone number' })
  @ApiResponse({ status: 201, description: 'Contact request sent' })
  async sendContactRequest(
    @Request() req,
    @Body() dto: SendContactRequestDto,
  ) {
    return this.contactsService.sendContactRequest(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all approved contacts' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved' })
  async getContacts(
    @Request() req,
    @Query() query: GetContactsQueryDto,
  ) {
    return this.contactsService.getContacts(req.user.id, query);
  }

  @Get('requests/sent')
  @ApiOperation({ summary: 'Get pending requests sent by me' })
  @ApiResponse({ status: 200, description: 'Sent requests retrieved' })
  async getSentRequests(@Request() req) {
    return this.contactsService.getSentRequests(req.user.id);
  }

  @Get('requests/received')
  @ApiOperation({ summary: 'Get invitations received' })
  @ApiResponse({ status: 200, description: 'Received invitations retrieved' })
  async getReceivedRequests(@Request() req) {
    return this.contactsService.getReceivedRequests(req.user.id);
  }

  @Post('requests/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve contact request' })
  @ApiResponse({ status: 200, description: 'Request approved' })
  async approveRequest(
    @Request() req,
    @Param('id') requestId: string,
  ) {
    return this.contactsService.approveRequest(req.user.id, requestId);
  }

  @Post('requests/:id/decline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decline contact request' })
  @ApiResponse({ status: 200, description: 'Request declined' })
  async declineRequest(
    @Request() req,
    @Param('id') requestId: string,
  ) {
    return this.contactsService.declineRequest(req.user.id, requestId);
  }

  @Delete('requests/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel sent request' })
  @ApiResponse({ status: 200, description: 'Request cancelled' })
  async cancelRequest(
    @Request() req,
    @Param('id') requestId: string,
  ) {
    return this.contactsService.cancelRequest(req.user.id, requestId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove contact' })
  @ApiResponse({ status: 200, description: 'Contact removed' })
  async removeContact(
    @Request() req,
    @Param('id') contactId: string,
  ) {
    return this.contactsService.removeContact(req.user.id, contactId);
  }

  @Post(':id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Block contact' })
  @ApiResponse({ status: 200, description: 'Contact blocked' })
  async blockContact(
    @Request() req,
    @Param('id') contactId: string,
  ) {
    return this.contactsService.blockContact(req.user.id, contactId);
  }
}

