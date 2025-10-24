import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomJwtService } from './jwt.service';
import { Response, Request } from 'express';
import { walletLoginDto, socialLoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async loginWallet(loginDto: walletLoginDto, res: Response) {

    const userEntity = await this.usersService.findOrCreateWalletUser(loginDto)
    const walletUserPayload = { userAddress: loginDto.userAddress, userId: userEntity._id };
    // Generate access token (15 minutes)
    const accessToken = this.jwtService.signAccessToken(walletUserPayload);

    // Generate refresh token (7 days)
    const refreshToken = this.jwtService.signRefreshToken(walletUserPayload);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken,
      ...userEntity,
    };
  }

   loginSocial(loginDto: socialLoginDto, res: Response) {
    const payload = { email: loginDto.email };

    // Generate access token (15 minutes)
    const accessToken = this.jwtService.signAccessToken(payload);

    // Generate refresh token (7 days)
    const refreshToken = this.jwtService.signRefreshToken(payload);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken,
    };
  }

  refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      // Verify the refresh token
      const decoded = this.jwtService.verifyRefreshToken(refreshToken);
      const payload = { userAddress: (decoded as any).userAddress };

      // Generate new access token
      const accessToken = this.jwtService.signAccessToken(payload);

      return {
        accessToken,
      };
    } catch (error) {
      // Clear the refresh token cookie if it's expired or invalid
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'lax',
        path: '/auth/refresh',
      });

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  logout(res: Response) {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return { message: 'Logged out successfully' };
  }
}
