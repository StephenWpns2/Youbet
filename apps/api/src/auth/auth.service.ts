import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { VerifyOtpDto, GoogleAuthDto, AppleAuthDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redis: RedisService,
  ) {}

  async sendOtp(phone: string): Promise<{ success: boolean; expiresIn: number }> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Redis with 5-minute expiry
    const key = `otp:${phone}`;
    await this.redis.set(key, otp, 300);
    
    // TODO: Send SMS via Twilio
    console.log(`OTP for ${phone}: ${otp}`); // Development only
    
    return {
      success: true,
      expiresIn: 300,
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { phone, code, name, email } = dto;
    
    // Verify OTP from Redis
    const key = `otp:${phone}`;
    const storedOtp = await this.redis.get(key);
    
    if (!storedOtp || storedOtp !== code) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    
    // Delete OTP after successful verification
    await this.redis.del(key);
    
    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          phone,
          phoneVerified: true,
          name: name || `User ${phone.slice(-4)}`,
          email: email || `${phone.replace(/\D/g, '')}@youbet.temp`,
        },
      });
    } else {
      // Update phone verification
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true },
      });
    }
    
    // Generate JWT tokens
    const tokens = await this.generateTokens(user.id);
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  }

  async googleAuth(dto: GoogleAuthDto): Promise<AuthResponseDto> {
    // TODO: Verify Google ID token
    const { idToken, name, email } = dto;
    
    // Find or create user by email
    let user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          phone: `temp_${Date.now()}`, // Temporary phone
        },
      });
      
      // Create auth provider record
      await this.prisma.authProvider.create({
        data: {
          userId: user.id,
          provider: 'google',
          providerUserId: email,
        },
      });
    }
    
    const tokens = await this.generateTokens(user.id);
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  }

  async appleAuth(dto: AppleAuthDto): Promise<AuthResponseDto> {
    // TODO: Verify Apple ID token
    const { idToken, name, email } = dto;
    
    let user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          phone: `temp_${Date.now()}`,
        },
      });
      
      await this.prisma.authProvider.create({
        data: {
          userId: user.id,
          provider: 'apple',
          providerUserId: email,
        },
      });
    }
    
    const tokens = await this.generateTokens(user.id);
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            picks: true,
            followers: true,
            following: true,
          },
        },
      },
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    // Invalidate sessions in Redis
    await this.redis.del(`session:${userId}`);
    return { success: true };
  }

  private async generateTokens(userId: string) {
    const payload = { sub: userId };
    
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    // Store refresh token in Redis
    await this.redis.set(`refresh:${userId}`, refreshToken, 7 * 24 * 60 * 60);
    
    return { accessToken, refreshToken };
  }
}
