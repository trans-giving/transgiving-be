import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../dto/login.dto';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET') || 'access-token-secret',
    });
  }

  async validate(payload: TokenPayload) {
    return payload;
  }
}
