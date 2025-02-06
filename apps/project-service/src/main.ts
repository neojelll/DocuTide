import { NestFactory } from '@nestjs/core';
import { ProjectModule } from './project.module';

async function bootstrap() {
  const app = await NestFactory.create(ProjectModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
