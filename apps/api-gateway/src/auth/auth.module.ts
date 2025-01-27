import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'AUTH_MICROSERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'auth',
						brokers: ['localhost:9092'],
					},
					producerOnlyMode: true,
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
