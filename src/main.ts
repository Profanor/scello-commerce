import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  // Enable CORS for frontend access
  app.enableCors({
    origin: ['http://localhost:3000'],
  });

  // Apply global validation pipe, using class-transformer internally for validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Izy Mini E-Commerce API')
    .setDescription('API documentation for managing products')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(4000);
}
bootstrap();
