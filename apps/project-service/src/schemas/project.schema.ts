import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ default: () => uuidv4(), unique: true })
  id: string;

  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  description: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export type ProjectDocument = Project & Document;
