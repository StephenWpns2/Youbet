import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { PicksService } from './picks.service';

@ApiTags('picks')
@Controller('picks')
export class PicksController {
  constructor(private readonly picksService: PicksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all picks (paginated)' })
  async findAll() {
    return this.picksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pick by ID' })
  async findOne(@Param('id') id: string) {
    return this.picksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new pick' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        eventId: { type: 'string' },
        market: { type: 'string', example: 'Moneyline' },
        selection: { type: 'string', example: 'Lakers ML' },
        oddsDecimal: { type: 'number', example: 2.5 },
        stake: { type: 'number', example: 100 },
        book: { type: 'string', example: 'DraftKings' },
      },
    },
  })
  async create(@Body() data: any) {
    return this.picksService.create(data);
  }
}

