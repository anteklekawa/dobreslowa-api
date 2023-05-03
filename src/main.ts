import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('dobreslowa-api')
    .setDescription('#dobreslowa - swagger')
    .setVersion('1.0')
    .addTag('')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
      origin: '*',
      credentials: true
  })
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(1337);
}
bootstrap();
