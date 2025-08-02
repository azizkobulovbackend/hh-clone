import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterBodyDto, RegisterResponseDto } from './dto/register.dto';
import { PrismaService } from './database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from '@app/logger';
import { LoginBodyDto, LoginResponseDto } from './dto/login.dto';
import {
  UserConfirmBodyDto,
  UserConfirmResponseDto,
} from './dto/user-confirm.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly pinoLogger: PinoLogger,
    private readonly amqpService: AmqpConnection,
  ) {}
  async register(body: RegisterBodyDto): Promise<RegisterResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.username }],
      },
      select: {
        id: true,
      },
    });

    if (user) {
      this.pinoLogger.error(`User already exists`);
      throw new HttpException('Register failed', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.prisma.user.create({
      data: {
        name: body.name,
        fullname: body.fullname,
        password: await bcrypt.hash(body.password, SALT_ROUNDS),
        username: body.username,
        email: body.email,
      },
    });

    const token = await this.jwtService.signAsync(
      { sub: newUser.id },
      { expiresIn: '15m' },
    );

    await this.amqpService.publish('mailer', 'user.confirmation', {
      email: newUser.email,
      name: newUser.name,
      token,
    });

    return {
      accessToken: await this.jwtSign({
        id: newUser.id,
        email: newUser.email,
      }),
      message: 'Successfully registered user',
    };
  }

  async login(body: LoginBodyDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      this.pinoLogger.error('User not found');
      throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
    }

    return {
      accessToken: await this.jwtSign({
        id: user.id,
        email: user.email,
      }),
      message: 'Successfully logged in',
    };
  }

  async confirmUser(id: string): Promise<UserConfirmResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.confirmed) {
      this.pinoLogger.error('User not found or already confirmed');
      throw new HttpException('Invalid confirmation', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: { id },
      data: { confirmed: true },
    });

    return { message: 'User confirmed' };
  }

  private jwtSign(payload: { id: string; email: string }) {
    return this.jwtService.signAsync(payload);
  }
}
