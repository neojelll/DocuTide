import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserGetPayload } from '../../../interfaces/dto/user-get.interface';

export class UserGetDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  hashPassword: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(userGetPayload: UserGetPayload) {
    this.userId = userGetPayload.userId;
    this.email = userGetPayload.email;
    this.username = userGetPayload.username;
    this.hashPassword = userGetPayload.hashPassword;
    this.biography = userGetPayload.biography;
    this.role = userGetPayload.role;
    this.createdAt = userGetPayload.createdAt;
    this.updatedAt = userGetPayload.updatedAt;
  }

  async stringify(): Promise<string> {
    return JSON.stringify(this, null, 2);
  }
}
