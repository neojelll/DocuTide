import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
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
