import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";
import { RedisService } from "src/adapters/redis/redis.service";
import { JwtPayload } from '../../common/dto/jwt.payload';
import { UserIdentity } from "../../common/dto/user.identity";
import { AuthzService } from "src/modules/authz/authz.service";
import { conf } from "conf/conf";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly authzService: AuthzService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const authToken = req.headers['authorization'];

        if (!authToken.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid auth token');
        }

        try {
            const splittedToken = authToken.split(' ')[1]
            const jwtPayload: JwtPayload = this.jwtService.verify(splittedToken, {
                secret: conf.JWT_SECRET,
            })

            const redisValue = await this.redisService.get(this.authzService.getRedisKeyName(jwtPayload.sub))
            if (!redisValue) {
                throw new UnauthorizedException("Invalid auth token")
            }

            const userIdentity = plainToInstance(UserIdentity, JSON.parse(redisValue))
            req["userIdentity"] = userIdentity

            return true
        } catch (error) {
            console.error(error)
            throw new UnauthorizedException("Unauthorized")
        }
    }
}