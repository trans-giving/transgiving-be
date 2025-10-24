// custom-jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CustomJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(payload: any): string {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') || 'access-token-secret',
        expiresIn: '15m'
      }
    );
  }

  signRefreshToken(payload: any): string {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'refresh-token-secret',
        expiresIn: '7d'
      }
    );
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(
      token,
      {secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') || 'access-token-secret',}
    );
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(
      token,
      {secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'refresh-token-secret',}
    );
  }
}
