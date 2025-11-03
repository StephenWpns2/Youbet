import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class SendContactRequestDto {
  @ApiProperty({ example: '+15551234567' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Hey! Let\'s connect on YouBet', required: false })
  @IsString()
  @IsOptional()
  message?: string;
}

export class ApproveContactRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requestId: string;
}

export class GetContactsQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, default: 50 })
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  offset?: number;
}

