import {
  IsBoolean,
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

  @IsBoolean()
  @IsNotEmpty()
  emailConfirmed: boolean;

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

  @IsBoolean()
  @IsNotEmpty()
  notificationsEnabled: boolean;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(userGetPayload: UserGetPayload) {
    this.userId = userGetPayload.userId;
    this.email = userGetPayload.email;
    this.emailConfirmed = userGetPayload.emailConfirmed;
    this.username = userGetPayload.username;
    this.hashPassword = userGetPayload.hashPassword;
    this.biography = userGetPayload.biography;
    this.role = userGetPayload.role;
    this.notificationsEnabled = userGetPayload.notificationsEnabled;
    this.createdAt = userGetPayload.createdAt;
    this.updatedAt = userGetPayload.updatedAt;
  }

  async stringify(): Promise<string> {
    return JSON.stringify(this, null, 2);
  }
}
