import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  async register(): Promise<unknown> {
    return this.authService.register();
  }
}
