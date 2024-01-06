import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBody {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}