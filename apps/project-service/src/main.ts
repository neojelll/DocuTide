import { NestFactory } from '@nestjs/core';
import { ProjectServiceModule } from './project-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProjectServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
