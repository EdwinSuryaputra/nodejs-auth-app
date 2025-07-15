import { Body, Controller, Headers, HttpCode, Post, UseGuards } from "@nestjs/common"
import { AuthnService } from "./authn.service"
import { LoginPayload as LoginPayload, LoginResult as LoginResult } from "./dto/login"
import { AuthGuard } from 'src/modules/authz/auth.guard';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("authn")
@ApiTags("authn")
export class AuthnController {
    constructor(
        private readonly authnService: AuthnService,
    ) { }

    @Post("login")
    @HttpCode(200)
    @ApiOperation({ summary: "User login" })
    @ApiResponse({ status: 200, description: "Returns user info and auth token", type: LoginResult })
    @ApiBody({ type: LoginPayload })
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
    @HttpCode(200)
    @ApiOperation({ summary: "User logout" })
    @ApiResponse({ status: 200, description: "Returns logout result" })
    @ApiHeader({ name: "authorization" })
    @UseGuards(AuthGuard)
    async logout(@Headers('authorization') authToken: string) {
        this.authnService.logout(authToken)
        return { result: true }
    }
}
