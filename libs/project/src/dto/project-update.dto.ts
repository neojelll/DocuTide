import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class ProjectUpdateDto {
  @IsUUID()
  @ApiPropertyOptional({
    description: 'The unique identifier of the user associated with the project.',
    type: String,
  })
  userId?: string;

  @IsUUID()
  @ApiPropertyOptional({
    description: 'The unique identifier of the project to be updated.',
    type: String,
  })
  projectId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @ApiPropertyOptional({
    description: 'The name of the project, must be between 1 and 30 characters long.',
    type: String,
    minLength: 1,
    maxLength: 30,
    default: '',
  })
  name?: string;

  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'A brief description of the project, maximum 500 characters.',
    type: String,
    maxLength: 500,
    default: '',
  })
  about?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'Content of the project, which may include details or specifications.',
    type: String,
    default: '',
  })
  content?: string;
}
