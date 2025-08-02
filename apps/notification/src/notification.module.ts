import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        exchanges: [{ name: 'topic', type: 'topic' }],
        uri: config.get<string>('RABBITMQ_URI') ?? 'amqp://localhost:5672',
        connectionInitOptions: { wait: true },
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
