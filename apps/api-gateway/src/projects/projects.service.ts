import { ProjectCreateDto } from '@lib/project/dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PROJECTS_MICROSERVICE') private readonly projectsClient: ClientKafka,
  ) {}

  async createProject(projectCreateDto: ProjectCreateDto) {
    const result = this.projectsClient.send(process.env.PROJECT_CREATE_TOPIC, JSON.stringify(projectCreateDto)); // ???
    return result;
  }

  async getProject(userId: string, projectId: string) {
    const payload = {
      userId,
      projectId,
    }

    const result = this.projectsClient.send(process.env.PROJECT_GET_TOPIC, JSON.stringify(payload));
    return result;
  }

  async getAllProjects(userId: string) {
    const result = this.projectsClient.send(process.env.PROJECT_GET_ALL_TOPIC, JSON.stringify(userId));
    return result;
  }

  async updateProject(projectId: string) {
    const result = this.projectsClient.send(process.env.PROJECT_UPDATE_TOPIC, JSON.stringify(projectId));
    return result;
  }

  async deleteProject(userId: string, projectId: string) { // ???
    const result = this.projectsClient.send(process.env.PROJECT_DELETE_TOPIC, JSON.stringify(projectId));
    return result;
  }
}
