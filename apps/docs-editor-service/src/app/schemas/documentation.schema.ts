import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Documentation extends Document {
  @Prop({ default: () => uuidv4(), unique: true })
  documentId: string;

  @Prop({ required: true, default: '' })
  projectId: string;

  @Prop({ required: true, default: '' })
  content: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DocumentationSchema = SchemaFactory.createForClass(Documentation);

export type DocumentationDocument = Documentation &
  Document & { createdAt: Date; updatedAt: Date };
