import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus } from '@youbet/database';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findUpcoming(filters: { sport?: string; league?: string }) {
    return this.prisma.event.findMany({
      where: {
        status: EventStatus.SCHEDULED,
        startTime: {
          gte: new Date(),
        },
        ...(filters.sport && { sport: filters.sport }),
        ...(filters.league && { league: filters.league }),
      },
      orderBy: { startTime: 'asc' },
      take: 50,
    });
  }
}

