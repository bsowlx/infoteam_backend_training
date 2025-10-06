import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    //remove properties that are not in the DTO
    whitelist: true,
    //throw an error if non-whitelisted properties are present
    forbidNonWhitelisted: true,
    //enavle transformations 
    transform: true,
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
