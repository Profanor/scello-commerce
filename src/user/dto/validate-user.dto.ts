import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
