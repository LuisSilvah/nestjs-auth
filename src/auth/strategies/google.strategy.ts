import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { UserGoogleProfile } from '../models/UserGoogleProfile';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.CLIENTE_ID,
            clientSecret: process.env.CLIENTE_SECRET,
            callbackURL: process.env.CALBACK_URL,
            scope: ['email', 'profile'],
        });
    }
    async validate(access_token: string, refreshToken: string, profile: any,  done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        const user: UserGoogleProfile = {
            firstName: name.givenName,
            lastName: name.familyName,
            email: emails[0].value,
            picture: photos[0].value,
            access_google: access_token,
        }
        done(null, user);
    }
}