import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // so you can inject PrismaService anywhere without importing this module again
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
