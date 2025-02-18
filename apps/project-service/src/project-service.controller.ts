import {Controller, Param} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectService } from './project-service.service';
import { ProjectCreateDto, ProjectUpdateDto } from '@docu-tide/core/dtos';
import {JwtPayload} from "@docu-tide/core/auth";

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern(process.env['PROJECT_CREATE_TOPIC'] || 'project.create')
  async handleCreateProject(@Payload() projectData: ProjectCreateDto) {
    console.log('Received create project request:', projectData);
    const result = await this.projectService.createProject(projectData);
    console.log('Project created successfully:', result);
    return result;
  }

  @MessagePattern(process.env['PROJECT_GET_ALL_TOPIC'] || 'project.get.all')
  async handleGetAllProjects() {
    console.log('Received request to get all projects');
    const result = await this.projectService.getAllProjects();
    console.log('Fetched all projects:', result);
    return result;
  }

  @MessagePattern(process.env['PROJECT_GET_TOPIC'] || 'project.get')
  async handleGetProjectByProjectName(@Payload() data: { jwtPayload: JwtPayload; projectName: string }) {
    console.log('Received request to get project by projectName:', data.projectName);
    const result = await this.projectService.getProjectByProjectname(data.projectName);
    console.log('Fetched project by projectName:', result);
    return result;
  }

  @MessagePattern(process.env['PROJECT_UPDATE_TOPIC'] || 'project.update')
  async handleUpdateProject(@Payload() payload: ProjectUpdateDto) {
    console.log('Received update project request:', payload);
    const { ...projectData } = payload;
    const result = await this.projectService.updateProject(payload.oldProjectName, projectData);
    console.log('Project updated successfully:', result);
    return result;
  }

  @MessagePattern(process.env['PROJECT_DELETE_TOPIC'] || 'project.delete')
  async handleDeleteProject(@Payload() data: { jwtPayload: JwtPayload; projectName: string }) {
    console.log('Received delete project request for ID:', data.projectName);
    const result = await this.projectService.deleteProject(data.projectName);
    console.log('Project deleted successfully:', result);
    return result;
  }
}
