import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateIdpUserDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
