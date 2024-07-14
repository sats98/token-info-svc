import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AccessKey } from './access-key.entity';
import { AccessKeyService } from './access-key.service';

@Controller('keys')
export class AccessKeyController {
  constructor(private readonly accessKeyService: AccessKeyService) {}


  @Post()
  create(@Body() body: { key: string; rateLimit: number; expiration: Date }): Promise<AccessKey> {
    const { key, rateLimit, expiration } = body;
    return this.accessKeyService.create(key, rateLimit, expiration);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { rateLimit: number; expiration: Date }
  ): Promise<AccessKey> {
    const { rateLimit, expiration } = body;
    return this.accessKeyService.update(Number(id), rateLimit, expiration);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.accessKeyService.remove(Number(id));
  }
}
