import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PinoLogger } from './logger.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  providers: [PinoLogger],
  exports: [PinoLogger],
})
export class PinoModule {}
