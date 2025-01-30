import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class ProjectReadDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier of the project',
    type: String,
  })
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @ApiProperty({
    description: 'The name of the project',
    type: String,
    minLength: 1,
    maxLength: 30,
  })
  name: string;

  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'A brief description of the project',
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

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date when the project was created, in ISO format.',
    type: String,
    example: '2025-01-01T00:00:00Z',
  })
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date when the project was last updated, in ISO format.',
    type: String,
    example: '2025-01-02T00:00:00Z',
  })
  updatedAt: Date;
}
