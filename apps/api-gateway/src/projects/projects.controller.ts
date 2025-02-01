import { ProjectCreateDto, ProjectUpdateDto } from '@lib/project/dto'
import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Patch, Post, ValidationPipe } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { ProjectsService } from './projects.service'

@Controller('users/:userId/projects')
export class ProjectsController implements OnModuleInit {
  constructor(
    private readonly projectsService: ProjectsService,
    @Inject('PROJECTS_MICROSERVICE') private readonly projectsClient: ClientKafka,
  ) {}

  @Post()
  async createProject(@Param('userId') userId: string, @Body(ValidationPipe) projectCreateDto: ProjectCreateDto) {
    return await this.projectsService.createProject(userId, projectCreateDto);
  }

  @Get(':projectId')
  async getProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.projectsService.getProject(userId, projectId);
  }

  @Get()
  async getAllProjects(@Param('userId') userId: string) {
    return await this.projectsService.getAllProjects(userId);
  }

  @Patch(':projectId')
  async updateProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe) projectUpdateDto: ProjectUpdateDto,
  ) {
    return await this.projectsService.updateProject(userId, projectId, projectUpdateDto);
  }

  @Delete(':projectId')
  async deleteProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.projectsService.deleteProject(userId, projectId);
  }

  async onModuleInit() {
    this.projectsClient.subscribeToResponseOf(process.env.PROJECT_CREATE_TOPIC || 'project.create');
    this.projectsClient.subscribeToResponseOf(process.env.PROJECT_CREATED_TOPIC || 'project.created');
    this.projectsClient.subscribeToResponseOf(process.env.PROJECT_GET_TOPIC || 'project.get');
    this.projectsClient.subscribeToResponseOf(process.env.PROJECT_GET_ALL_TOPIC || 'project.get.all');
    this.projectsClient.subscribeToResponseOf(process.env.PROJECT_UPDATE_TOPIC || 'project.update');
    this.projectsClient.subscribeToResponseOf(process.env.PROJECT_DELETE_TOPIC || 'project.delete');
    await this.projectsClient.connect();
  }
}
