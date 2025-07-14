import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { plainToInstance } from 'class-transformer';
import { UserIdentity } from "src/common/dto/user.identity"
import { GenerateAuthTokenPayload, GenerateAuthTokenResult } from "./dto/generate.auth.token"
import { RedisService } from "src/adapters/redis/redis.service"
import { JwtPayload } from "../../common/dto/jwt.payload";
import { conf } from "conf/conf";

@Injectable()
export class AuthzService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) { }

    generateAuthToken(payload: GenerateAuthTokenPayload): GenerateAuthTokenResult {
        const jwtPayload: JwtPayload = { sub: payload.user.username, iat: Date.now() }
        const authToken = `Bearer ${this.jwtService.sign(jwtPayload, {
            "secret": conf.JWT_SECRET,
        })}`

        const redisKeyName = this.getRedisKeyName(payload.user.username)
        const redisValue: UserIdentity = {
            userId: payload.user.id,
            username: payload.user.username,
            email: payload.user.email,
            name: payload.user.name,
            authToken: authToken,
        }
        const redisExpiresIn = conf.JWT_EXPIRES_IN_SECONDS

        this.redisService.set(redisKeyName, JSON.stringify(redisValue), redisExpiresIn)

        return { authToken: authToken }
    }

    async verifyAuthToken(authToken: string): Promise<UserIdentity> {
        if (!authToken.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid token');
        }

        const splittedToken = authToken.split(' ')[1];
        const jwtPayload: JwtPayload = this.jwtService.verify(splittedToken)

        const redisValue = await this.redisService.get(this.getRedisKeyName(jwtPayload.sub))
        if (!redisValue) {
            throw new UnauthorizedException("Unauthorized")
        }

        const userIdentity = plainToInstance(UserIdentity, JSON.parse(redisValue))

        return userIdentity
    }

    async revokeAuthToken(authToken: string) {
        const jwtPayload = await this.verifyAuthToken(authToken)
        if (jwtPayload != null) {
            this.redisService.del(this.getRedisKeyName(jwtPayload.username))
        }
    }

    getRedisKeyName(username: string): string {
        return `bearer-token-${username}`
    }

}