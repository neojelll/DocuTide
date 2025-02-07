import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project-service.controller';
import { ProjectService } from './project-service.service';
import { Project, ProjectSchema } from './schemas/project.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://admin:secret@localhost:27017'
    ),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ClientsModule.register([
      {
        name: 'PROJECT_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'project-service',
            brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
          },
          consumer: {
            groupId: 'project-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectServiceModule {}
