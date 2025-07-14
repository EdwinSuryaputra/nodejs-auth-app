import { Global, Module } from '@nestjs/common'
import { AuthzService } from './authz.service'
import { AuthzController } from './authz.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from './auth.guard'

@Global()
@Module({
    imports: [],
    controllers: [
        AuthzController,
    ],
    providers: [
        AuthzService,
        AuthGuard,
    ],
    exports: [
        AuthzService,
        // AuthGuard,
    ],
})
export class AuthzModule { }
