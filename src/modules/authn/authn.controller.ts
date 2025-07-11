import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from "@nestjs/common"
import { Request, Response } from "express"
import { AuthnService } from "./authn.service"
import { LoginPayload as LoginPayloadDto, LoginResult as LoginResultDto } from "./dto/login.dto"

@Controller("authn")
export class AuthnController {
    constructor(
        private readonly authnService: AuthnService,
    ) { }

    @Post("login")
    async login(@Body() loginDto: LoginPayloadDto): Promise<LoginResultDto> {
        const result = await this.authnService.login(loginDto)

        return new LoginResultDto("", "", "")
    }

    @Post("logout")
    async logout() {
        
    }

    // @Get("get-identity")
    // @UseGuards(AuthGuard)
    // async getIdentity(@Req() req: Request, @Res() res: Response) {
    //     const result = await this.authService.getIdentity(req["headers"]["authorization"])
    //     if (result instanceof EndpointErrorResult) {
    //         return res.status(result.error.code).json(result)
    //     }

    //     return res.status(HttpStatus.OK).json(new EndpointSuccessResult(result))
    // }

    // @Put("change-password")
    // @UseGuards(AuthGuard)
    // async addUser(@Req() req: Request, @Body() changePasswordSpec: ChangePasswordSpec, @Res() res: Response): Promise<object> {
    //     const result = await this.authService.changePassword(req["userIdentity"], changePasswordSpec)
    //     if (result instanceof EndpointErrorResult) {
    //         return res.status(result.error.code).json(result)
    //     }

    //     return res.status(HttpStatus.OK).json(new EndpointSuccessResult(result))
    // }
}
