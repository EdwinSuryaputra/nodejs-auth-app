import { Global, Module } from '@nestjs/common'
import { AuthnController } from './authn.controller'
import { AuthnService } from './authn.service'
import { PrismaService } from 'src/adapters/db/prisma.service'
import { AuthzService } from '../authz/authz.service'

@Global()
@Module({
    imports: [],
    controllers: [
        AuthnController,
    ],
    providers: [
        AuthnService,
    ],
    exports: [],
})
export class AuthnModule { }
