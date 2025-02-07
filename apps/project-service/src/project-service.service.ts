import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {ProjectUpdateDto} from "@lib/project/dto";

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectsClient: ClientKafka,
  ) {}

  async createProject(ownerId: string) {
    return Promise.resolve(undefined);
  }

  async getAllProjects() {
    return Promise.resolve(undefined);
  }

  async getProjectById(projectId: string) {
    return Promise.resolve(undefined);
  }

  async updateUser(projectId: string, data: ProjectUpdateDto) {
    return Promise.resolve(undefined);
  }

  async deleteUser(projectId: string) {
    return Promise.resolve(undefined);
  }
}
