import {
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
} from '@docu-tide/project/lib/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectsClient: ClientKafka
  ) {}

  async createProject(
    userId: string,
    projectCreateDto: ProjectCreateDto
  ): Promise<string> {
    const payload: ProjectCreateDto = {
      ownerId: userId,
      ...projectCreateDto,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env.PROJECT_CREATE_TOPIC,
        JSON.stringify(payload)
      )
    );

    return result;
  }

  async getProject(userId: string, projectId: string): Promise<ProjectReadDto> {
    const payload = {
      userId,
      projectId,
    };

    const result: ProjectReadDto = await firstValueFrom(
      this.projectsClient.send(
        process.env.PROJECT_GET_TOPIC,
        JSON.stringify(payload)
      )
    );

    return result;
  }

  async getAllProjects(userId: string): Promise<Array<ProjectReadDto>> {
    const result: Array<ProjectReadDto> = await firstValueFrom(
      this.projectsClient.send(
        process.env.PROJECT_GET_ALL_TOPIC,
        JSON.stringify(userId)
      )
    );

    return result;
  }

  async updateProject(
    userId: string,
    projectId: string,
    projectUpdateDto: ProjectUpdateDto
  ): Promise<string> {
    const payload: ProjectUpdateDto = {
      projectId,
      ...projectUpdateDto,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env.PROJECT_UPDATE_TOPIC,
        JSON.stringify(payload)
      )
    );

    return result;
  }

  async deleteProject(userId: string, projectId: string): Promise<string> {
    const payload = {
      userId,
      projectId,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env.PROJECT_DELETE_TOPIC,
        JSON.stringify(payload)
      )
    );

    return result;
  }
}
