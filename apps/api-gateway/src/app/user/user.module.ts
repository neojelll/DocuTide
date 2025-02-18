import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users',
            brokers: [process.env['MESSAGE_BROKER_URL']],
          },
          consumer: {
            groupId: 'users-consumer',
          },
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
