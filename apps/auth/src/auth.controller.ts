import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { InterceptorsService } from '@app/interceptors';

import { RegisterBodyDto, RegisterResponseDto } from './dto/register.dto';
import { AuthGuard } from './guard/auth.guard';
import { LoginBodyDto, LoginResponseDto } from './dto/login.dto';
import {
  UserConfirmBodyDto,
  UserConfirmResponseDto,
} from './dto/user-confirm.dto';
import { ApiBody } from '@nestjs/swagger';
import { User } from '@app/decorators';
import { JwtService } from '@nestjs/jwt';
@UseInterceptors(InterceptorsService)
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDto): Promise<RegisterResponseDto> {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }

  @Get('confirm')
  async confirmByToken(
    @Query('token') token: string,
  ): Promise<UserConfirmResponseDto> {
    const payload = await this.jwtService.verifyAsync(token);
    return this.authService.confirmUser(payload.sub);
  }
}
