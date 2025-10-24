import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { socialLoginDto, walletLoginDto } from './dto/login.dto';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-wallet')
  @HttpCode(HttpStatus.OK)
  async loginByWallet(
    @Body() loginDto: walletLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginWallet(loginDto, res);
  }

  @Post('login-social')
  @HttpCode(HttpStatus.OK)
  async loginBySocialAccount(
    @Body() loginDto: socialLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginSocial(loginDto, res);
  }

  @Get('refresh')
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('profile')
  @UseGuards(JwtAccessTokenGuard)
  getProfile(@Req() request) {
    console.log(request.user);
    
    return {
      message: 'success',
      user: request.user,
    };
  }
}
