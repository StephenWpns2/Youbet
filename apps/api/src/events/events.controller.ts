import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiQuery({ name: 'sport', required: false, example: 'NBA' })
  @ApiQuery({ name: 'league', required: false, example: 'NBA Regular Season' })
  async findUpcoming(
    @Query('sport') sport?: string,
    @Query('league') league?: string,
  ) {
    return this.eventsService.findUpcoming({ sport, league });
  }
}

