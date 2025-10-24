import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { TokenPayload } from '../dto/login.dto';
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt',
) {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET') || 'refresh-token-secret',
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: TokenPayload) {
		// return await this.authService.getUserIfRefreshTokenMatched(
		// 	payload.userAddress,
		// 	request.headers.authorization?.split('Bearer ')[1],
		// );
    return {
      userAddress: payload.userAddress,
      accessToken: request.headers.authorization?.split('Bearer ')[1],
    }
	}
}
