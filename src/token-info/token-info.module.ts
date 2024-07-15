import { Module } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { TokenInfoController } from './token-info.controller';
import { TokenInfoService } from './token-info.service';

@Module({
  imports: [],
  controllers: [TokenInfoController],
  providers: [TokenInfoService, RedisService]
})
export class TokenInfoModule { }
