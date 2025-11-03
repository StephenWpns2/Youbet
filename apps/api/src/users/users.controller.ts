import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':handle')
  @ApiOperation({ summary: 'Get user profile by handle' })
  @ApiParam({ name: 'handle', example: 'mikej_bets' })
  async getProfile(@Param('handle') handle: string) {
    return this.usersService.getProfile(handle);
  }

  @Get(':handle/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiParam({ name: 'handle', example: 'mikej_bets' })
  async getStats(@Param('handle') handle: string) {
    return this.usersService.getStats(handle);
  }
}

