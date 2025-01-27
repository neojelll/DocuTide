import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'USER_MICROSERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'users',
						brokers: ['localhost:9092'],
					},
					producerOnlyMode: true,
					consumer: {
						groupId: 'users-consumer',
					},
				},
			},
		]),
	],
	providers: [],
	controllers: [],
})
export class UsersModule {}
