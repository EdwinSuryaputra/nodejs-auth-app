import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entities/Users'
import { UserAPIRoutes } from './controllers/UserAPIRoutes'
import { UserServiceImpl } from './services/UserServiceImpl'
import { AuthAPIRoutes } from './controllers/AuthAPIRoutes'
import { AuthServiceImpl } from './services/AuthServiceImpl'
import { JwtModule } from '@nestjs/jwt'
import { Roles } from 'src/entities/Roles'
import { conf } from 'conf/Conf'
import { ProfileCmsServiceImpl } from '../cms/services/ProfileCmsServiceImpl'
import { Profiles } from 'src/entities/Profiles'
import { SubscriptionCmsServiceImpl } from '../cms/services/SubscriptionCmsServiceImpl'
import { Subscriptions } from '../../entities/Subscriptions'
import { FileServiceImpl } from '../file/services/FileServiceImpl'
import { Files } from 'src/entities/Files'
import { AWSS3Service } from 'src/infrastructures/AWSS3Service'
import { Products } from 'src/entities/Products'

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Roles, Profiles, Subscriptions, Files, Products]),
        JwtModule.register({
            global: true,
            secret: conf.JWT_SECRET_KEY,
            signOptions: { expiresIn: conf.JWT_EXPIRES_IN },
        }),
    ],
    controllers: [
        AuthAPIRoutes,
        UserAPIRoutes,
    ],
    providers: [
        AuthServiceImpl,
        UserServiceImpl,
        ProfileCmsServiceImpl,
        SubscriptionCmsServiceImpl,
        FileServiceImpl,
        AWSS3Service,
    ],
    exports: [
        AuthServiceImpl,
    ],
})
export class AuthnModule { }
