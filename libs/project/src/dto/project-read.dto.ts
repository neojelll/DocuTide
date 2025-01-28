import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'

export class ProjectReadDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(500)
  about?: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
