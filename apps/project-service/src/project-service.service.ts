import { ProjectReadDto, ProjectUpdateDto } from '@docu-tide/project/lib/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(ownerId: string): Promise<ProjectReadDto> {
    const newProject = new this.projectModel({
      ownerId: ownerId,
    });
    return this.toProjectReadDto(await newProject.save());
  }

  async getAllProjects(): Promise<ProjectReadDto[]> {
    const projects = await this.projectModel.find().exec();
    return projects.map(this.toProjectReadDto);
  }

  async getProjectById(projectId: string) {
    const project = await this.projectModel.findOne({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    return this.toProjectReadDto(project);
  }

  async updateProject(
    projectId: string,
    data: ProjectUpdateDto,
  ): Promise<ProjectReadDto> {
    const updatedProject = await this.projectModel.findOneAndUpdate({
      id: projectId,
      data: data,
    });
    if (!updatedProject) {
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    return this.toProjectReadDto(updatedProject);
  }

  async deleteProject(projectId: string) {
    const deletedProject = await this.projectModel.findOneAndDelete({
      id: projectId,
    });
    if (!deletedProject) {
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    return `Project with ID ${projectId} deleted successfully.`;
  }

  private toProjectReadDto(project: ProjectDocument): ProjectReadDto {
    const plainProject = project.toObject();

    return {
      id: plainProject.id,
      name: plainProject.name,
      description: plainProject.description,
      ownerId: plainProject.ownerId,
      tags: plainProject.tags,
      createdAt: plainProject.createdAt,
      updatedAt: plainProject.updatedAt,
    };
  }
}
