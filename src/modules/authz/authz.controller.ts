import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common"
import { AuthGuard } from "src/modules/authz/auth.guard"
import { ApiOperation, ApiResponse, ApiHeader, ApiTags } from "@nestjs/swagger"

@Controller("authz")
@ApiTags("authz")
export class AuthzController {
    constructor(
    ) { }

    @Get("validate")
    @HttpCode(200)
    @ApiOperation({ summary: "Validate user auth token" })
    @ApiResponse({ status: 200, description: "Returns auth validation" })
    @ApiHeader({ name: "authorization" })
    @UseGuards(AuthGuard)
    async validate() {
        return {
            "result": true,
        }
    }
}