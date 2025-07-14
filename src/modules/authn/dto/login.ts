import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginPayload {
    @IsString()
    username: string

    @IsString()
    @MinLength(6)
    password: string
}

export class LoginResult {
    userId: number
    username: string
    email: string
    name: string
    authToken: string
}