import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ default: () => uuidv4(), unique: true })
  userId: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  hashPassword: string;

  @Prop()
  bio?: string;

  @Prop({ default: 'user' })
  role?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User &
  Document & { createdAt: Date; updatedAt: Date };
