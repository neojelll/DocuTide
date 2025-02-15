import { DocsDto } from '@docu-tide/docs/lib/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Documentation,
  DocumentationDocument,
} from './schemas/documentation.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Documentation.name)
    private documentationModel: Model<DocumentationDocument>,
  ) {}
  async newDocumentation(message: { projectname: string; docsDto: DocsDto }) {
    const newDocumentation = new this.documentationModel({
      projectname: message.projectname,
      content: message.docsDto.content,
    });

    await newDocumentation.save();

    return 'successful save new documentation';
  }

  async getDocumentation(message: { projectname: string }) {
    const documentation = await this.documentationModel.findOne({
      projectname: message.projectname,
    });

    if (!documentation) {
      throw new NotFoundException(
        `documentation with projectname: ${message.projectname} is not found`,
      );
    }

    return documentation.toObject();
  }
}
