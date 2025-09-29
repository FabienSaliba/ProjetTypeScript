import { NestFactory } from '@nestjs/core';
import { GareModule } from './gare.module';

async function bootstrap() {
  const app = await NestFactory.create(GareModule);
  await app.listen(8080);
}
bootstrap();
