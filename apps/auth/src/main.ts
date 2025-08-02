import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Agrobank Mani Project')
    .setDescription('The agrobank API description')
    .setVersion('1.0')
    .addTag('mani app')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.AUTH_PORT ?? 3000);
}
bootstrap();
