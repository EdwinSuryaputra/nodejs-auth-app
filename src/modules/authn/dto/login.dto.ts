import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginPayload {
    @IsString()
    username: string

    @IsString()
    @MinLength(6)
    password: string
}

export class LoginResult {
    username: string
    name: string
    token: string

    constructor(token: string, username: string, name: string) {
        this.username = username
        this.name = name
        this.token = token
    }
}