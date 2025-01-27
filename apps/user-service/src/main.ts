import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './service/user-service.module';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
