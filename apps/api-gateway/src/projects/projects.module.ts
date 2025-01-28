import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROJECTS_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'projects',
            brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9092'],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'projects-consumer',
          },
        },
      },
    ]),
  ],
  providers: [],
  controllers: [],
})
export class ProjectsModule {}
