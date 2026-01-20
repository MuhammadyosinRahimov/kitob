import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [ 'http://localhost:3001', 'http://localhost:3000'], // Frontend URL
    credentials: true,
  });

  // Serve Static Files
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Global Validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('ScienceHub API')
    .setDescription('The ScienceHub API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3004); // Backend on 3004
}
bootstrap();
