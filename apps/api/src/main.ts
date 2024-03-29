/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  const port = process.env.port || 3333;
  const host = process.env.host || '127.0.0.1';
  await app.listen(port, () => {
    console.log('Listening at ' + host + ':' + port + '/' + globalPrefix);
  });
}

bootstrap();
