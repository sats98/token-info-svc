import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { TokenInfoService } from './token-info.service';
import { RedisService } from '../redis/redis.service';

@Controller('tokens')
export class TokenInfoController {
  constructor(
    private readonly tokenInfoService: TokenInfoService,
    private readonly redisService: RedisService,
  ) {}

  @Get(':key')
  async getTokenInfo(@Param('key') key: string): Promise<any> {
    const isValid = await this.tokenInfoService.checkRateLimit(key);

    if (!isValid) {
      return {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Rate limit exceeded'
      };
    }

    try {
      const tokenInfo = await this.tokenInfoService.getTokenInfo(key);
      return tokenInfo;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching token information'
      };
    }
  }
}
