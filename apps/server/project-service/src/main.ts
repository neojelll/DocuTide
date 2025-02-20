import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProjectServiceModule } from './project-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProjectServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'project',
          brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
        },
        consumer: {
          groupId: 'api-consumer',
        },
      },
    },
  );
  await app.listen();
}

bootstrap();
