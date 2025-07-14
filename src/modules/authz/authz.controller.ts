import { Controller, Get, Headers, UseGuards } from "@nestjs/common"
import { AuthzService } from "./authz.service"
import { AuthGuard } from "src/modules/authz/auth.guard"

@Controller("authz")
export class AuthzController {
    constructor(
    ) { }

    @Get("validate")
    @UseGuards(AuthGuard)
    async validate(@Headers('authorization') authToken: string) {
        return {
            "result": true,
        }
    }
}