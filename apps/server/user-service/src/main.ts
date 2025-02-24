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
          clientId: process.env['USER_SERVICE_CLIENT_ID'],
          brokers: [process.env['MESSAGE_BROKER_URL']],
        },
        consumer: {
          groupId: process.env['USER_SERVICE_GROUP_ID'],
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
