import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'user',
          brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
        },
        consumer: {
          groupId: 'auth-consumer',
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
