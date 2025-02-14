import { JwtPayload } from '@docu-tide/core/auth';
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
    private readonly projectsClient: ClientKafka,
  ) {}

  async createProject(
    user: JwtPayload,
    projectCreateDto: ProjectCreateDto,
  ): Promise<string> {
    const payload: ProjectCreateDto = {
      ownerId: user.sub,
      ...projectCreateDto,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_CREATE_TOPIC'],
        JSON.stringify(payload),
      ),
    );

    return result;
  }

  async getProject(
    user: JwtPayload,
    projectname: string,
  ): Promise<ProjectReadDto> {
    const payload = {
      ...user,
      projectname,
    };

    const result: ProjectReadDto = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_GET_TOPIC'],
        JSON.stringify(payload),
      ),
    );

    return result;
  }

  async getAllProjects(user: JwtPayload): Promise<Array<ProjectReadDto>> {
    const result: Array<ProjectReadDto> = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_GET_ALL_TOPIC'],
        JSON.stringify(user),
      ),
    );

    return result;
  }

  async updateProject(
    user: JwtPayload,
    projectname: string,
    projectUpdateDto: ProjectUpdateDto,
  ): Promise<string> {
    const payload: ProjectUpdateDto = {
      ...user,
      name: projectname,
      ...projectUpdateDto,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_UPDATE_TOPIC'],
        JSON.stringify(payload),
      ),
    );

    return result;
  }

  async deleteProject(user: JwtPayload, projectname: string): Promise<string> {
    const payload = {
      ...user,
      projectname,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_DELETE_TOPIC'],
        JSON.stringify(payload),
      ),
    );

    return result;
  }
}
