import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
// import { fieldEncryptionMiddleware } from 'prisma-field-encryption';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }
  async onModuleInit(): Promise<void> {
    await this.$connect();

    // this.$use(fieldEncryptionMiddleware());
  }
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
