import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  userName?: string;
  // @IsString()
  // @IsOptional()
  // userAddress?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
