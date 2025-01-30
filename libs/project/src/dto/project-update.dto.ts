import { IsString } from 'class-validator'

export class ProjectUpdateDto {
  @IsString()
  name?: string;

  @IsString()
  about?: string;

  @IsString()
  content?: string;
}
