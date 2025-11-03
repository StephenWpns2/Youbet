import { IsEmail, IsString, IsPhoneNumber, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @MinLength(3)
  handle: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsPhoneNumber()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  code: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class GoogleAuthDto {
  @ApiProperty()
  @IsString()
  accessToken: string;
}

export class AppleAuthDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}

