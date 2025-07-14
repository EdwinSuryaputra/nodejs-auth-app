import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() // so you can inject RedisService anywhere without importing this module again
@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule { }
