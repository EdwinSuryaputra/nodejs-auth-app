import { Controller, Get } from "@nestjs/common"

@Controller("healthz")
export class HealthzController {
    constructor() { }

    @Get("")
    login() {
        return {
            "result": true,
        }
    }
}
