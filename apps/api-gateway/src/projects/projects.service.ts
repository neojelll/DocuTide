import {
  ProjectCreateDto,
  ProjectReadDto,
  ProjectUpdateDto,
} from '@lib/project/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectsClient: ClientKafka,
  ) {}

  async createProject(
    userId: string,
    projectCreateDto: ProjectCreateDto,
  ): Promise<Observable<string>> {
    const payload: ProjectCreateDto = {
      userId,
      ...projectCreateDto,
    };

    const result: Observable<string> = this.projectsClient.send(
      process.env.PROJECT_CREATE_TOPIC,
      JSON.stringify(payload),
    );
    return result;
  }

  async getProject(
    userId: string,
    projectId: string,
  ): Promise<Observable<ProjectReadDto>> {
    const payload = {
      userId,
      projectId,
    };

    const result: Observable<ProjectReadDto> = this.projectsClient.send(
      process.env.PROJECT_GET_TOPIC,
      JSON.stringify(payload),
    );
    return result;
  }

  async getAllProjects(
    userId: string,
  ): Promise<Observable<Array<ProjectReadDto>>> {
    const result: Observable<Array<ProjectReadDto>> = this.projectsClient.send(
      process.env.PROJECT_GET_ALL_TOPIC,
      JSON.stringify(userId),
    );
    return result;
  }

  async updateProject(
    userId: string,
    projectId: string,
    projectUpdateDto: ProjectUpdateDto,
  ): Promise<Observable<string>> {
    const payload: ProjectUpdateDto = {
      userId,
      projectId,
      ...projectUpdateDto,
    };

    const result: Observable<string> = this.projectsClient.send(
      process.env.PROJECT_UPDATE_TOPIC,
      JSON.stringify(payload),
    );
    return result;
  }

  async deleteProject(
    userId: string,
    projectId: string,
  ): Promise<Observable<string>> {
    const payload = {
      userId,
      projectId,
    };

    const result: Observable<string> = this.projectsClient.send(
      process.env.PROJECT_DELETE_TOPIC,
      JSON.stringify(payload),
    );
    return result;
  }
}
