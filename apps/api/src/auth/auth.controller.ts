import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  SendOtpDto,
  VerifyOtpDto,
  GoogleAuthDto,
  AppleAuthDto,
  AuthResponseDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('phone/send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto.phone);
  }

  @Post('phone/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and sign in/sign up' })
  @ApiResponse({ status: 200, description: 'OTP verified, user authenticated', type: AuthResponseDto })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with Google' })
  @ApiResponse({ status: 200, description: 'Google authentication successful', type: AuthResponseDto })
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto): Promise<AuthResponseDto> {
    return this.authService.googleAuth(googleAuthDto);
  }

  @Post('apple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with Apple' })
  @ApiResponse({ status: 200, description: 'Apple authentication successful', type: AuthResponseDto })
  async appleAuth(@Body() appleAuthDto: AppleAuthDto): Promise<AuthResponseDto> {
    return this.authService.appleAuth(appleAuthDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}

