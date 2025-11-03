import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FeedService } from './feed.service';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  @ApiOperation({ summary: 'Get personalized feed' })
  @ApiQuery({ name: 'scope', enum: ['all', 'following'], required: false })
  @ApiQuery({ name: 'cursor', required: false })
  async getFeed(
    @Query('scope') scope?: 'all' | 'following',
    @Query('cursor') cursor?: string,
  ) {
    return this.feedService.getFeed({ scope, cursor });
  }
}

