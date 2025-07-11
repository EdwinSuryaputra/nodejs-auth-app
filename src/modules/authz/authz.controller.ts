import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from "@nestjs/common"
import { Request, Response } from "express"
import { LoginDto } from "src/data/auth/AuthDtos"
import { EndpointErrorResult } from "src/helper/EndpointErrorResult"
import { EndpointSuccessResult } from "src/helper/EndpointSuccessResult"
import { AuthServiceImpl } from "../services/AuthServiceImpl"
import { ChangePasswordSpec } from "src/data/auth/ChangePasswordDto"
import { AuthGuard } from "../jwt/AuthGuard"

@Controller("authn")
export class AuthAPIRoutes {
    constructor(
        private readonly authService: AuthServiceImpl,
    ) { }

    @Post("login")
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const result = await this.authService.login(loginDto)
        if (result instanceof EndpointErrorResult) {
            return res.status(result.error.code).json(result)
        }

        return res.status(HttpStatus.OK).json(new EndpointSuccessResult(result))
    }

    @Get("get-identity")
    @UseGuards(AuthGuard)
    async getIdentity(@Req() req: Request, @Res() res: Response) {
        const result = await this.authService.getIdentity(req["headers"]["authorization"])
        if (result instanceof EndpointErrorResult) {
            return res.status(result.error.code).json(result)
        }

        return res.status(HttpStatus.OK).json(new EndpointSuccessResult(result))
    }

    @Put("change-password")
    @UseGuards(AuthGuard)
    async addUser(@Req() req: Request, @Body() changePasswordSpec: ChangePasswordSpec, @Res() res: Response): Promise<object> {
        const result = await this.authService.changePassword(req["userIdentity"], changePasswordSpec)
        if (result instanceof EndpointErrorResult) {
            return res.status(result.error.code).json(result)
        }

        return res.status(HttpStatus.OK).json(new EndpointSuccessResult(result))
    }
}
