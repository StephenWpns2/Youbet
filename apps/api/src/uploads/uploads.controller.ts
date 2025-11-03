import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('sign')
  @ApiOperation({ summary: 'Get presigned URL for file upload' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filename: { type: 'string', example: 'slip.jpg' },
        contentType: { type: 'string', example: 'image/jpeg' },
      },
    },
  })
  async getPresignedUrl(@Body() data: { filename: string; contentType: string }) {
    return this.uploadsService.getPresignedUrl(data.filename, data.contentType);
  }
}

