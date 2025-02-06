import { Module } from '@nestjs/common';
import { ProjectServiceController } from './project-service.controller';
import { ProjectServiceService } from './project-service.service';

@Module({
  imports: [],
  controllers: [ProjectServiceController],
  providers: [ProjectServiceService],
})
export class ProjectServiceModule {}
