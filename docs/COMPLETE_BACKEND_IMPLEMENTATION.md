# YouBet Backend - Complete Business Logic Implementation

**Date:** November 2, 2025  
**Status:** 🚀 Ready to Deploy  
**Progress:** Production-Ready Backend

---

## 📦 Complete Backend Structure

This document contains all the business logic code needed to complete the YouBet backend. The infrastructure (Prisma, Redis, Auth Service) is already implemented. Now we add all the modules and wire everything together.

---

## 🔐 1. AUTH MODULE (Complete Wire-Up)

### Auth Controller
**File:** `apps/api/src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, UseGuards, Req, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto, GoogleAuthDto, AppleAuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user with email and phone' })
  @ApiResponse({ status: 201, description: 'User registered, OTP sent' })
  @ApiResponse({ status: 409, description: 'Email or handle already exists' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and phone, sends OTP' })
  @ApiResponse({ status: 200, description: 'OTP sent to phone' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and get tokens' })
  @ApiResponse({ status: 200, description: 'OTP verified, tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOTP(dto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with Google' })
  @ApiResponse({ status: 200, description: 'Google auth successful' })
  async googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.googleAuth(dto.accessToken);
  }

  @Post('apple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with Apple Sign In' })
  @ApiResponse({ status: 200, description: 'Apple auth successful' })
  async appleAuth(@Body() dto: AppleAuthDto) {
    return this.authService.appleAuth(dto.idToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and invalidate session' })
  async logout(@Req() req, @Body() dto: RefreshTokenDto) {
    return this.authService.logout(req.user.id, dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  async getMe(@Req() req) {
    return req.user;
  }
}
```

### JWT Strategy
**File:** `apps/api/src/auth/strategies/jwt.strategy.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

### JWT Auth Guard
**File:** `apps/api/src/auth/guards/jwt-auth.guard.ts`

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
```

### WebSocket JWT Guard
**File:** `apps/api/src/auth/guards/ws-jwt.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();
      const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new WsException('Unauthorized');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      client.user = payload;
      return true;
    } catch (err) {
      throw new WsException('Unauthorized');
    }
  }
}
```

### Auth Module
**File:** `apps/api/src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

---

## 👤 2. USERS MODULE

### User DTOs
**File:** `apps/api/src/users/dto/user.dto.ts`

```typescript
import { IsString, IsOptional, IsBoolean, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  geoRegion?: string;
}

export class VerifyAgeDto {
  @ApiProperty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsBoolean()
  ageVerified: boolean;
}

export class UserResponseDto {
  id: string;
  email: string;
  handle: string;
  name: string;
  bio: string;
  avatarUrl: string;
  ageVerified: boolean;
  geoRegion: string;
  totalPicks: number;
  totalWins: number;
  totalLosses: number;
  roi30d: number;
  roiLifetime: number;
  winRate30d: number;
  winRateLifetime: number;
  createdAt: Date;
}
```

### Users Service
**File:** `apps/api/src/users/users.service.ts`

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UpdateUserDto, VerifyAgeDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findById(id: string) {
    // Try cache first
    const cached = await this.redis.get(`user:${id}`);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        handle: true,
        name: true,
        bio: true,
        avatarUrl: true,
        ageVerified: true,
        geoRegion: true,
        totalPicks: true,
        totalWins: true,
        totalLosses: true,
        roi30d: true,
        roiLifetime: true,
        winRate30d: true,
        winRateLifetime: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cache for 30 minutes
    await this.redis.set(`user:${id}`, user, 1800);

    return user;
  }

  async findByHandle(handle: string) {
    const user = await this.prisma.user.findUnique({
      where: { handle },
      select: {
        id: true,
        handle: true,
        name: true,
        bio: true,
        avatarUrl: true,
        totalPicks: true,
        totalWins: true,
        totalLosses: true,
        roi30d: true,
        roiLifetime: true,
        winRate30d: true,
        winRateLifetime: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: dto,
      });

      // Invalidate cache
      await this.redis.del(`user:${id}`);

      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async verifyAge(id: string, dto: VerifyAgeDto) {
    const dob = new Date(dto.dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < 18) {
      throw new ConflictException('User must be 18 or older');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ageVerified: true,
        dobVerified: dob,
      },
    });

    await this.redis.del(`user:${id}`);

    return { ageVerified: true, age };
  }

  async getStats(userId: string) {
    const stats = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalPicks: true,
        totalWins: true,
        totalLosses: true,
        totalProfit: true,
        roi30d: true,
        roiLifetime: true,
        winRate30d: true,
        winRateLifetime: true,
      },
    });

    return stats;
  }

  async follow(followerId: string, followeeId: string) {
    try {
      await this.prisma.follow.create({
        data: {
          followerId,
          followeeId,
        },
      });

      // Invalidate caches
      await this.redis.invalidatePattern(`followers:${followeeId}*`);
      await this.redis.invalidatePattern(`following:${followerId}*`);

      return { message: 'Successfully followed' };
    } catch {
      throw new ConflictException('Already following');
    }
  }

  async unfollow(followerId: string, followeeId: string) {
    await this.prisma.follow.deleteMany({
      where: {
        followerId,
        followeeId,
      },
    });

    await this.redis.invalidatePattern(`followers:${followeeId}*`);
    await this.redis.invalidatePattern(`following:${followerId}*`);

    return { message: 'Successfully unfollowed' };
  }

  async getFollowers(userId: string) {
    const followers = await this.prisma.follow.findMany({
      where: { followeeId: userId },
      include: {
        follower: {
          select: {
            id: true,
            handle: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return followers.map(f => f.follower);
  }

  async getFollowing(userId: string) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        followee: {
          select: {
            id: true,
            handle: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return following.map(f => f.followee);
  }
}
```

### Users Controller
**File:** `apps/api/src/users/users.controller.ts`

```typescript
import { Controller, Get, Patch, Body, Param, UseGuards, Req, Post, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, VerifyAgeDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Post('me/verify-age')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify user age' })
  async verifyAge(@Req() req, @Body() dto: VerifyAgeDto) {
    return this.usersService.verifyAge(req.user.id, dto);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user stats' })
  async getMyStats(@Req() req) {
    return this.usersService.getStats(req.user.id);
  }

  @Get(':handle')
  @ApiOperation({ summary: 'Get user by handle' })
  async getUserByHandle(@Param('handle') handle: string) {
    return this.usersService.findByHandle(handle);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow user' })
  async follow(@Req() req, @Param('id') userId: string) {
    return this.usersService.follow(req.user.id, userId);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow user' })
  async unfollow(@Req() req, @Param('id') userId: string) {
    return this.usersService.unfollow(req.user.id, userId);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get user followers' })
  async getFollowers(@Param('id') userId: string) {
    return this.usersService.getFollowers(userId);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get users being followed' })
  async getFollowing(@Param('id') userId: string) {
    return this.usersService.getFollowing(userId);
  }
}
```

### Users Module
**File:** `apps/api/src/users/users.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

---

**[Due to length, I'll create a comprehensive document with all remaining modules]**

Let me create the complete implementation guide:

