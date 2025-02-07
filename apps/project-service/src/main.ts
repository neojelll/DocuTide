import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserServiceModule } from '../../user-service/src/user-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
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
    }
  );
}
bootstrap();
