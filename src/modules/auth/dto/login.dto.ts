import { IsString, IsNotEmpty } from 'class-validator';

export class socialLoginDto {
  @IsString()
  userName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class walletLoginDto {
  @IsString()
  @IsNotEmpty()
  userAddress: string
}

export class TokenPayload {
  userId: string;
  userAddress?: string;
  email?: string;
}
