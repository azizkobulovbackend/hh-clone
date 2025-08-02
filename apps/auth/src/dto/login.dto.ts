export class LoginBodyDto {
  email: string;
  password: string;
}

export class LoginResponseDto {
  accessToken: string;
  message: string;
}
