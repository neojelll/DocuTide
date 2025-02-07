import {
  Controller,
  Param,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectUpdateDto } from '@lib/project/dto';
import { ProjectService } from './project-service.service';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern(process.env.PROJECT_CREATE_TOPIC || 'project.create')
  async handleCreateProject(@Param('ownerId') ownerId: string) {
    return await this.projectService.createProject(ownerId);
  }

  @MessagePattern(process.env.PROJECT_GET_ALL_TOPIC || 'project.get.all')
  async handleGetAllProjects() {
    return await this.projectService.getAllProjects();
  }

  @MessagePattern(process.env.PROJECT_GET_TOPIC || 'project.get')
  async handleGetProjectById(@Param(':projectId') projectId: string) {
    return await this.projectService.getProjectById(projectId);
  }

  @MessagePattern(process.env.PROJECT_UPDATE_TOPIC || 'project.update')
  async handleUpdateProject(
    @Payload() payload: { projectId: string; data: ProjectUpdateDto },
  ) {
    return await this.projectService.updateProject(
      payload.projectId,
      payload.data,
    );
  }

  @MessagePattern(process.env.PROJECT_DELETE_TOPIC || 'project.delete')
  async handleDeleteProject(@Payload() projectId: string) {
    return await this.projectService.deleteProject(projectId);
  }
}
