import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBodyDto } from './database/dto/register.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  async register(@Body() body: RegisterBodyDto): Promise<unknown> {
    return this.authService.register(body);
  }
}
