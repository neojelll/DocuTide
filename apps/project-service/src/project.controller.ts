import {
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'apps/api-gateway/src/auth/guards/jwt-auth.guard';
import { ProjectCreateDto, ProjectUpdateDto } from '@lib/project/dto';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectsClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':ownerId')
  @MessagePattern(process.env.PROJECT_CREATE_TOPIC || 'project.create')
  async handleCreateProject(@Param('ownerId') ownerId: string) {
    return await this.projectService.createProject(ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(process.env.PROJECT_GET_ALL_TOPIC || 'project.get.all')
  @Get()
  async handleGetAllProjects() {
    return await this.projectService.getAllProjects();
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(process.env.PROJECT_GET_TOPIC || 'project.get')
  @Get(':projectId')
  async handleGetProjectById(@Param(':projectId') projectId: string) {
    return await this.projectService.getProjectById(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(process.env.PROJECT_UPDATE_TOPIC || 'project.update')
  @Patch(':projectId')
  async handleUpdateProject(
    @Payload() payload: { projectId: string; data: ProjectUpdateDto },
  ) {
    return await this.projectService.updateUser(
      payload.projectId,
      payload.data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(process.env.USER_DELETE_TOPIC || 'user.delete')
  async handleDeleteProject(@Payload() projectId: string) {
    return await this.projectService.deleteUser(projectId);
  }

  async onModuleInit() {
    this.projectsClient.subscribeToResponseOf(
      process.env.PROJECT_GET_ALL_TOPIC || 'project.get.all',
    );
    this.projectsClient.subscribeToResponseOf(
      process.env.PROJECT_GET_TOPIC || 'project.get',
    );
    this.projectsClient.subscribeToResponseOf(
      process.env.PROJECT_UPDATE_TOPIC || 'project.update',
    );
    this.projectsClient.subscribeToResponseOf(
      process.env.PROJECT_DELETE_TOPIC || 'project.delete',
    );
    await this.projectsClient.connect();
  }
}
