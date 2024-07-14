import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey } from './access-key.entity';
import { AccessKeyController } from './access-key.controller';
import { AccessKeyService } from './access-key.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessKey])],
  controllers: [AccessKeyController],
  providers: [AccessKeyService, RedisService]
})
export class AccessKeyModule { }
