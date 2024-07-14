import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis(
            { port: 6379, host: 'host.docker.internal' }
        );
    }

    getClient(): Redis {
        return this.client;
    }

    async publish(channel: string, message: any): Promise<void> {
        await this.client.publish(channel, JSON.stringify(message));
    }

    async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
        const sub = new Redis();
        await sub.subscribe(channel);
        sub.on('message', (ch, message) => {
            if (ch === channel) {
                callback(JSON.parse(message));
            }
        });
    }
}
