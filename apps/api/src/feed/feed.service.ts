import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeed(options: { scope?: 'all' | 'following'; cursor?: string }) {
    // Simplified feed logic - in production, use Redis for feed fan-out
    const picks = await this.prisma.pick.findMany({
      take: 20,
      ...(options.cursor && {
        skip: 1,
        cursor: {
          id: options.cursor,
        },
      }),
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
            status: true,
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

    return {
      picks,
      nextCursor: picks.length === 20 ? picks[picks.length - 1].id : null,
    };
  }
}

