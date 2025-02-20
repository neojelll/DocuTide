import { AuthLibModule, JwtStrategy } from '@docu-tide/core/auth';
import { EnvModule } from '@docu-tide/core/env';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    EnvModule,
    AuthLibModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: {
        expiresIn: process.env['JWT_EXPIRES'],
      },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [process.env['MESSAGE_BROKER_URL']],
          },
          consumer: {
            groupId: process.env['AUTH_GROUP_ID'],
          },
        },
      },
    ]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
