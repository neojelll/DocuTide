import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Documentation extends Document {
  @Prop({ required: true })
  projectname: string;

  @Prop({ required: true })
  content: string;
}

export const DocumentationSchema = SchemaFactory.createForClass(Documentation);

export type DocumentationDocument = Documentation & Document;
