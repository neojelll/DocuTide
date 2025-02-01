import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AuthServiceModule } from './auth-service.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
        },
        consumer: {
          groupId: 'auth-consumer',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
