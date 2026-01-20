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
    origin: true, // Allow all origins in development/production for simplicity, or configure via ENV
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

  const port = process.env.PORT || 3004;
  await app.listen(port); 
}
bootstrap();
