import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterBodyDto } from './database/dto/register.dto';
import { PrismaService } from './database/prisma.service';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async register(body: RegisterBodyDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.email }],
      },
    });

    if (user) {
      throw new HttpException('getTestSummary failed', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    await this.prisma.user.create({
      data: {
        name: body.name,
        fullname: body.fullname,
        password: hashedPassword,
        username: body.username,
        email: body.email,
      },
    });

    return {
      message: 'Successfully registered user',
    };
  }
}
