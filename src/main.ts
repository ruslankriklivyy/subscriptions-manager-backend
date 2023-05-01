import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const originUrls = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : '';
  const port = process.env.PORT ?? 3001;

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors({
    credentials: true,
    origin: originUrls,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(Number(port));
}
bootstrap();
