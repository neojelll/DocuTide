import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'AUTH_MICROSERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'auth',
						brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
					},
					consumer: {
						groupId: 'auth-consumer',
					},
				},
			},
		]),
	],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
