import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROJECTS_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'projects',
            brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
          },
          consumer: {
            groupId: 'projects-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}