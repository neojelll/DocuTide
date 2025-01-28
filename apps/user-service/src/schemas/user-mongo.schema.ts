import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserMongo extends Document {
  @Prop({ required: true, unique: true })
  userId: string;
}

export const UserMongoSchema = SchemaFactory.createForClass(UserMongo);