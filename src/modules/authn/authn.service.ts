import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "src/adapters/db/prisma.service"
import { LoginPayload, LoginResult } from "./dto/login"
import { AuthzService } from "../authz/authz.service"

@Injectable()
export class AuthnService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authzService: AuthzService,
    ) { }

    async login(loginPayload: LoginPayload): Promise<LoginResult> {
        const user = await this.prisma.users.findFirst({
            where: {
                username: loginPayload.username,
                deleted_at: null,
                deleted_by: null,
            }
        })
        if (!user) {
            throw new NotFoundException("User not found")
        } else if (loginPayload.password != user.password) {
            throw new UnauthorizedException("Invalid password")
        }

        const result = this.authzService.generateAuthToken({
            user: user,
        })

        return {
            userId: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            authToken: result.authToken,
        }
    }

    async logout(authToken: string) {
        this.authzService.revokeAuthToken(authToken)
    }
}