// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as cors from 'cors';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(new ValidationPipe());
//   app.use(cors({
//     origin: 'http://localhost:3000', // Cho phép yêu cầu từ React app
//     credentials: true, // Cho phép gửi cookie và các thông số xác thực
//   }));
//   await app.listen(4000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for a specific origin
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  // app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(4000);
}

bootstrap();
