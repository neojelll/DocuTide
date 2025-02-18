import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ default: () => uuidv4(), unique: true })
  projectId: string;

  @Prop({ required: true, default: '' })
  projectname: string;

  @Prop({ required: true, default: '' })
  description: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export type ProjectDocument = Project &
  Document & { createdAt: Date; updatedAt: Date };
