import { HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { IsNull, Repository } from "typeorm"
import { AuthService } from "../interfaces/AuthService"
import { UserServiceImpl } from "./UserServiceImpl"
import { Roles } from "src/entities/Roles"
import { LoginDto, LoginResult } from "src/data/auth/AuthDtos"
import { conf } from "conf/Conf"
import { EndpointErrorResult } from "src/helper/EndpointErrorResult"
import { UserIdentityPayload } from "src/data/auth/GetIdentityPayload"
import { UserRoleEnum } from "src/data/auth/UserRoleEnum"
import { ProfileCmsServiceImpl } from "src/modules/cms/services/ProfileCmsServiceImpl"
import { PublicFacingId } from "src/helper/PublicFacingId"
import { Users } from "src/entities/Users"
import { ChangePasswordSpec } from "src/data/auth/ChangePasswordDto"
import { GetUserDetailSpec, UpdateUserSpec } from "src/data/auth/UserDtos"
import { PasswordHashing } from "src/helper/PasswordFacing"

@Injectable()
export class AuthnService {
    constructor(
        // @InjectRepository(Roles)
        // private readonly roleRepository: Repository<Roles>,
        // private readonly jwtService: JwtService,

        @Inject(forwardRef(() => UserServiceImpl))
        private readonly userService: UserServiceImpl,

        // @Inject(forwardRef(() => ProfileCmsServiceImpl))
        // private readonly profileCmsService: ProfileCmsServiceImpl,
    ) { }

    async login(loginDto: LoginDto): Promise<LoginResult | EndpointErrorResult> {
        const [user, roles] = await Promise.all([
            this.userService.findUserByEmailAndPassword(loginDto.email, loginDto.password),
            this.roleRepository.find(),
        ])

        if (user instanceof EndpointErrorResult) {
            return user
        }

        if (roles.length < 1) {
            return new EndpointErrorResult(HttpStatus.UNPROCESSABLE_ENTITY, "Peran pengguna tidak ditemukan")
        }

        const role = UserRoleEnum[roles.find((role) => role.id === user.role_id).name]

        let payload: UserIdentityPayload

        if (role === UserRoleEnum["PROFILE_OWNER"]) {
            const result = await this.loginForProfileOwner(user, role)

            if (result instanceof EndpointErrorResult) {
                return result
            }

            payload = result
        } else if (role === UserRoleEnum["ADMIN"]) {
            payload = this.loginForAdmin(user, role)
        } else {
            return new EndpointErrorResult(HttpStatus.UNPROCESSABLE_ENTITY, "Akun pengguna dengan peran tersebut tidak ditemukan")
        }

        const token = await this.jwtService.signAsync({ ...payload }, {
            "secret": conf.JWT_SECRET_KEY,
            "expiresIn": conf.JWT_EXPIRES_IN,
        })

        /* await this.redisClientService.getRedisClient().setex(`${payload["email"]}`, token, conf.JWT_EXPIRES_IN) */

        return new LoginResult(token)
    }

    // private loginForAdmin(user: Users, role: UserRoleEnum): UserIdentityPayload | null {
    //     const payload = new UserIdentityPayload()
    //     payload.userId = PublicFacingId.toHash(user.id)
    //     payload.email = user.email
    //     payload.name = user.name
    //     payload.role = role
    //     payload.isActive = user.is_active

    //     return payload
    // }

    // private async loginForProfileOwner(user: Users, role: UserRoleEnum): Promise<UserIdentityPayload | EndpointErrorResult> {
    //     const profile = await this.profileCmsService.getProfileDetailByUserId(user.id)

    //     if (profile instanceof EndpointErrorResult) {
    //         return new EndpointErrorResult(HttpStatus.UNPROCESSABLE_ENTITY, "Profil tidak ditemukan")
    //     }

    //     const payload = new UserIdentityPayload()
    //     payload.userId = PublicFacingId.toHash(user.id)
    //     payload.email = user.email
    //     payload.name = user.name
    //     payload.role = role
    //     payload.profileId = profile.id
    //     payload.isActive = user.is_active

    //     return payload
    // }

    // async getRoles(): Promise<Roles[]> {
    //     return await this.roleRepository.find({
    //         "where": {
    //             "deleted_at": IsNull(),
    //             "deleted_by": IsNull(),
    //         }
    //     })
    // }

    // async getRoleById(roleId: number): Promise<Roles | null> {
    //     return await this.roleRepository.findOne({
    //         "where": {
    //             "id": roleId,
    //             "deleted_at": IsNull(),
    //             "deleted_by": IsNull(),
    //         },
    //     })
    // }

    // async getRoleByName(roleName: string): Promise<Roles | null> {
    //     return await this.roleRepository.findOne({
    //         "where": {
    //             "name": roleName,
    //             "deleted_at": IsNull(),
    //             "deleted_by": IsNull(),
    //         }
    //     })
    // }

    // async getIdentity(token: string): Promise<UserIdentityPayload | EndpointErrorResult> {
    //     try {
    //         return await this.jwtService.verifyAsync(
    //             token,
    //             {
    //                 secret: conf.JWT_SECRET_KEY,
    //             }
    //         )
    //     } catch (error) {
    //         return new EndpointErrorResult(HttpStatus.UNPROCESSABLE_ENTITY, error.message ? error.message : error, error.stack)
    //     }
    // }

    // async changePassword(userIdentity: UserIdentityPayload, spec: ChangePasswordSpec): Promise<Boolean | EndpointErrorResult> {
    //     try {
    //         if (spec.newPassword != spec.newPasswordConfirmation) {
    //             throw `Confirmation password is not match`
    //         }

    //         const user = await this.userService.getUserDetail(new GetUserDetailSpec(userIdentity.userId))
    //         if (user instanceof EndpointErrorResult) {
    //             return user
    //         }

    //         if (!await PasswordHashing.compareHash(spec.currentPassword, user.password)) {
    //             throw `Current password is not match`
    //         }

    //         if (await PasswordHashing.compareHash(spec.newPassword, user.password)) {
    //             throw `New password must not equal with the current password`
    //         }

    //         const updateSpec = new UpdateUserSpec()
    //         updateSpec.id = userIdentity.userId
    //         updateSpec.name = user.name
    //         updateSpec.email = user.email
    //         updateSpec.isActive = Boolean(user.isActive)
    //         updateSpec.role = user.role
    //         updateSpec.password = spec.newPassword

    //         const updateUser = await this.userService.updateUser(userIdentity, updateSpec)
    //         if (updateUser instanceof EndpointErrorResult) {
    //             return updateUser
    //         }

    //         return true
    //     } catch (error) {
    //         return new EndpointErrorResult(HttpStatus.UNPROCESSABLE_ENTITY, error.message ? error.message : error, error.stack)
    //     }
    // }
}