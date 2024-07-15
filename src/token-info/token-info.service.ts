import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import axios from 'axios';

@Injectable()
export class TokenInfoService implements OnModuleInit {
  constructor(private readonly redisService: RedisService) { }

  onModuleInit() {
    this.redisService.subscribe('access_key_deleted', this.handleKeyDeleted.bind(this));
    this.redisService.subscribe('access_key_creation', this.handleKeyCreation.bind(this));
    this.redisService.subscribe('access_key_updated', this.handleKeyUpdated.bind(this));
  }

  private async handleKeyDeleted(message: {
    id: number,
    key: string,
    rateLimit: number,
    expiration: Date,
    active: boolean
  }): Promise<void> {
    console.log(`Received key deletion event for key ID ${message.id}`);
    const rateLimitKey = `rate_limit:${message.key}`;
    await this.redisService.getClient().del(rateLimitKey);
  }


  private async handleKeyCreation(message: {
    id: number,
    key: string,
    rateLimit: number,
    expiration: Date,
    active: boolean
  }): Promise<void> {
    // Handle key creation event
    console.log(`Received key deletion event for key ID ${message.id}`);
    const rateLimitKey = `rate_limit:${message.key}`;
    await this.redisService.getClient().set(rateLimitKey, JSON.stringify(message));
  }

  private async handleKeyUpdated(message: {
    id: number,
    key: string,
    rateLimit: number,
    expiration: Date,
    active: boolean
  }): Promise<void> {
    // Handle key update event
    console.log(`Received key update event for key ID ${message.id}`);
    const rateLimitKey = `rate_limit:${message.key}`;
    await this.redisService.getClient().set(rateLimitKey, JSON.stringify(message));
  }

  async getTokenInfo(tokenName: string): Promise<any> {
    // Replace with actual API call to CoinGecko or other data source
    try {
      return {
        data: `${tokenName}data`
      }
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenName}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching token information: ${error.message}`);
    }
  }

  async checkRateLimit(key: string): Promise<boolean> {
    try {
      const redisClient = this.redisService.getClient();
      const keyData = await redisClient.get(key);
      if (!keyData) {
        throw new Error(`Key ${key} not found in Redis.`);
      }
      const { rateLimit, expiration, active } = JSON.parse(keyData);
      if (!active) {
        throw new Error(`Key ${key} is not active.`);
      }
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expirationTimestamp = Math.floor(new Date(expiration).getTime() / 1000);
      if (currentTimestamp > expirationTimestamp) {
        throw new Error(`Key ${key} has expired.`);
      }

      const rateLimitKey = `rate_limit:${key}`;
      const response = await redisClient.pipeline()
        .incr(rateLimitKey)
        .expire(rateLimitKey, 60)  // Assuming rate limit should expire every minute
        .exec();

      const count = response[0][1];

      if (count > rateLimit) {
        return false;
      }

      return true;
    } catch (error) {
      throw new Error(`Error checking rate limit for key ${key}: ${error.message}`);
    }
  }

}
