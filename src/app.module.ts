import { Module } from '@nestjs/common';
import { PrismaModule } from './adapters/db/prisma.module';
import { AuthnModule } from './modules/authn/authn.module';
import { AuthzModule } from './modules/authz/authz.module';
import { RedisModule } from './adapters/redis/redis.module';
import { HealthzController } from './modules/healthz/healthz.controller';
import { JwtModule } from '@nestjs/jwt';
import { conf } from 'conf/conf';

@Module({
	imports: [
		PrismaModule,
		RedisModule,
		JwtModule.register({
			global: true,
			secret: conf.JWT_SECRET,
		}),
		AuthnModule,
		AuthzModule,
	],
	controllers: [
		HealthzController,
	],
	providers: [],
	exports: [],
})
export class AppModule { }
