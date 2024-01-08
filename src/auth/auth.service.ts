import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserGoogleProfile } from './models/UserGoogleProfile';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }


    async login(user: User): Promise<UserToken> {

        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        }

        const jwtToken = this.jwtService.sign(payload)

        return {
            access_token: jwtToken
        }
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(email);

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                };
            }
        }

        throw new UnauthorizedError('Email ou Senha está errada!')
    }

    async googleLogin(user: User): Promise<{user: User, access_token: string}> {
        try {
            const isEmailVerify = await this.userService.findByEmail(user.email)

            if (!isEmailVerify) {
                throw new HttpException('Não foi possivel encontrar usuário', HttpStatus.INTERNAL_SERVER_ERROR)
            }

            if (isEmailVerify) {
                const payload: UserPayload = {
                    sub: isEmailVerify.id,
                    email: user.email,
                    name: isEmailVerify.name
                }

                const jwtToken = this.jwtService.sign(payload)

                return {
                    user,
                    access_token: jwtToken
                }
            }

            throw new HttpException('Conta google inválida!', HttpStatus.INTERNAL_SERVER_ERROR)
            
        } catch {
            throw new HttpException('Conta google inválida!', HttpStatus.INTERNAL_SERVER_ERROR)
            
        }
    }

}