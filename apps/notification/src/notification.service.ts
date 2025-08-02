import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  @RabbitSubscribe({
    exchange: 'mailer',
    routingKey: 'user.confirmation',
    queue: 'user.confirmation.mail',
  })
  async handleConfirmation(data: {
    email: string;
    name: string;
    token: string;
  }) {
    const link = `http://localhost:3000/v1/auth/confirm?token=${data.token}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"MyApp" <no-reply@myapp.com>',
      to: data.email,
      subject: 'Please confirm your email',
      html: `
        <p>Hello ${data.name},</p>
        <p>Click below to confirm your account:</p>
        <a href="${link}">${link}</a>
      `,
    });
  }
}
