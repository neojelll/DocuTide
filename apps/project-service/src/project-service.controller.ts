import { Controller, Get } from '@nestjs/common';
import { ProjectServiceService } from './project-service.service';

@Controller()
export class ProjectServiceController {
  constructor(private readonly projectServiceService: ProjectServiceService) {}

  @Get()
  getHello(): string {
    return this.projectServiceService.getHello();
  }
}
