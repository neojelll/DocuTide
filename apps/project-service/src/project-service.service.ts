import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import {
  ProjectCreateDto,
  ProjectGetDto,
  ProjectUpdateDto,
} from '@docu-tide/core/dtos';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(projectData: ProjectCreateDto): Promise<string> {
    const newProject = new this.projectModel({
      ...projectData,
      userId: projectData.jwtPayload.sub,
    });

    try {
      const savedProject = await newProject.save();
      console.log('New project created:', savedProject);
      return new ProjectGetDto(savedProject).stringify();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }


  async getAllProjects() {
    console.log('Fetching all projects...');
    const projects = await this.projectModel.find().exec();
    console.log('Projects fetched:', projects);

    const result = projects.map((project) => {
      return new ProjectGetDto(project);
    });

    console.log('Fetched all projects:', result);
    return result;
  }



  async getProjectById(projectId: string): Promise<string> {
    console.log(`Fetching project by ID: ${projectId}`);
    const project = await this.projectModel.findOne({ id: projectId });
    if (!project) {
      console.log(`Project with ID ${projectId} not found.`);
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    console.log('Project found:', project);
    return new ProjectGetDto(project).stringify();
  }

  async getProjectByProjectname(projectname: string): Promise<string> {
    console.log(`Fetching project by projectname: ${projectname}`);
    const project = await this.projectModel.findOne({ projectname });
    if (!project) {
      console.log(`Project with projectname ${projectname} not found.`);
      throw new NotFoundException(`Project with projectname ${projectname} not found.`);
    }
    console.log('Project found:', project);
    return new ProjectGetDto(project).stringify();
  }

  async updateProject(projectId: string, data: ProjectUpdateDto): Promise<string> {
    console.log(`Updating project with ID: ${projectId} with data:`, data);
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ projectId }, data, { new: true })
      .exec();
    if (!updatedProject) {
      console.log(`Project with ID ${projectId} not found for update.`);
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    console.log('Updated project:', updatedProject);
    return new ProjectGetDto(updatedProject).stringify();
  }

  async deleteProject(projectId: string): Promise<string> {
    console.log(`Deleting project with ID: ${projectId}`);
    const deletedProject = await this.projectModel
      .findOneAndDelete({ projectId })
      .exec();
    if (!deletedProject) {
      console.log(`Project with ID ${projectId} not found for deletion.`);
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    console.log(`Project with ID ${projectId} deleted successfully.`);
    return `Project with ID ${projectId} deleted successfully.`;
  }
}
