import { Module } from '@nestjs/common';
import { PrismaModule } from './adapters/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
