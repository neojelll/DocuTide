import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'USERS_MICROSERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'users',
						brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9092'],
					},
					producerOnlyMode: true,
					consumer: {
						groupId: 'users-consumer',
					},
				},
			},
		]),
	],
	providers: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
