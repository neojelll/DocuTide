import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ProjectUpdateDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the project to be updated.',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the project',
    type: String,
    example: 'Updated Project Name',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Description of the project',
    type: String,
    example: 'Updated description.',
  })
  description: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Updated tags for the project',
    type: [String],
    example: ['updated', 'tech'],
  })
  tags: string[];

  constructor(params: {
    projectId: string;
    name: string;
    description: string;
    tags: string[];
  }) {
    this.projectId = params.projectId;
    this.name = params.name;
    this.description = params.description;
    this.tags = params.tags;
  }
}
