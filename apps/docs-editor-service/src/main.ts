import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentEditorModule } from './app/document-editor.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DocumentEditorModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'docs-editor-service',
          brokers: [process.env['MESSAGE_BROKER_URL']],
        },
        consumer: {
          groupId: process.env['DOCS_GROUP_ID'],
        },
      },
    },
  );
  await app.listen();
}

bootstrap();
