import { NestFactory } from '@nestjs/core';
import { DocsEditorModule } from './docs-editor.module';

async function bootstrap() {
  const app = await NestFactory.create(DocsEditorModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
