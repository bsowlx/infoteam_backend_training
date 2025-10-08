import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Posts API')
    .setDescription('API for bulletin CRUD operations   ')
    .setVersion('1.0')
    .addTag('posts')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    //remove properties that are not in the DTO
    whitelist: true,
    //throw an error if non-whitelisted properties are present
    forbidNonWhitelisted: true,
    //enable transformations
    transform: true,
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
