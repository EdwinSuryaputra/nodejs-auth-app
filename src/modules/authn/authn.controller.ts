import { Body, Controller, Headers, Post, UnauthorizedException, UseGuards } from "@nestjs/common"
import { AuthnService } from "./authn.service"
import { LoginPayload as LoginPayload, LoginResult as LoginResult } from "./dto/login"
import { AuthGuard } from 'src/modules/authz/auth.guard';

@Controller("authn")
export class AuthnController {
    constructor(
        private readonly authnService: AuthnService,
    ) { }

    @Post("login")
    async login(@Body() loginPayload: LoginPayload): Promise<LoginResult> {
        const result = await this.authnService.login(loginPayload)
        return {
            userId: result.userId,
            username: result.username,
            email: result.email,
            name: result.name,
            authToken: result.authToken,
        }
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    async logout(@Headers('authorization') authToken: string) {
        if (!authToken) {
            throw new UnauthorizedException("Invalid authorization")
        }

        this.authnService.logout(authToken)
        return { result: true }
    }
}
