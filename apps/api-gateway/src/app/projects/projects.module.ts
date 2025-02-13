import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROJECTS_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'projects',
            brokers: [process.env['MESSAGE_BROKER_URL']],
          },
          consumer: {
            groupId: 'projects-consumer',
          },
        },
      },
    ]),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
