import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  // @IsNotEmpty()
  userName: string;

  @IsString()
  // @IsNotEmpty()
  userAddress: string;

  @IsString()
  avatar?: string;

  @IsString()
  // @IsNotEmpty()
  @MinLength(6)
  password: string;
}
