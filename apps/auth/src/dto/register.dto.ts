import { IsEmail, IsString } from 'class-validator';

export class RegisterBodyDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  fullname: string;

  @IsString()
  password: string;

  @IsString()
  username: string;
}

export class RegisterResponseDto {
  accessToken: string;
  message: string;
}
