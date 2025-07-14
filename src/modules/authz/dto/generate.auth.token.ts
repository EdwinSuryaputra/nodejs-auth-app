import { users } from '@prisma/client';

export class GenerateAuthTokenPayload {
    user: users
}

export class GenerateAuthTokenResult {
    authToken: string
}