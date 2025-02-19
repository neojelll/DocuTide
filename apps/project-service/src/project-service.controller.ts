import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectService } from './project-service.service';
import { ProjectCreateDto, ProjectUpdateDto } from '@docu-tide/core/dtos';
import { JwtPayload } from '@docu-tide/core/auth';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern(process.env['PROJECT_CREATE_TOPIC'])
  async handleCreateProject(@Payload() projectData: ProjectCreateDto) {
    return await this.projectService.createProject(projectData);
  }

  @MessagePattern(process.env['PROJECT_GET_ALL_TOPIC'])
  async handleGetAllProjects() {
    return await this.projectService.getAllProjects();
  }

  @MessagePattern(process.env['PROJECT_GET_TOPIC'])
  async handleGetProjectByProjectName(
    @Payload() data: { jwtPayload: JwtPayload; projectName: string },
  ) {
    return await this.projectService.getProjectByProjectname(data.projectName);
  }

  @MessagePattern(process.env['PROJECT_UPDATE_TOPIC'])
  async handleUpdateProject(@Payload() payload: ProjectUpdateDto) {
    const { ...projectData } = payload;
    return await this.projectService.updateProject(
      payload.oldProjectName,
      projectData,
    );
  }

  @MessagePattern(process.env['PROJECT_DELETE_TOPIC'])
  async handleDeleteProject(
    @Payload() data: { jwtPayload: JwtPayload; projectName: string },
  ) {
    return await this.projectService.deleteProject(data.projectName);
  }
}
