import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(handle: string) {
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
        totalProfit: true,
        roi30d: true,
        roiLifetime: true,
        winRate30d: true,
        winRateLifetime: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User @${handle} not found`);
    }

    return {
      ...user,
      followers: user._count.followers,
      following: user._count.following,
    };
  }

  async getStats(handle: string) {
    const user = await this.prisma.user.findUnique({
      where: { handle },
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

    if (!user) {
      throw new NotFoundException(`User @${handle} not found`);
    }

    return user;
  }
}

