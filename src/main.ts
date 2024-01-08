import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //uso global de interceptor, e a serialização dos dados nas requisições.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  await app.listen(5000);
}
bootstrap();
