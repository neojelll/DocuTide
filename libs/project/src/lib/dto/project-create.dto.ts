import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ProjectCreateDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the user associated with the project.',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ownerId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the project',
    type: String,
    example: 'Insanely AWESOMEE!!!! project',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Description of the project',
    type: String,
    example: 'This is a project.',
  })
  description: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Tags associated with the project',
    type: [String],
    example: ['opensource', 'tech'],
  })
  tags: string[];

  constructor(params: {
    ownerId: string;
    name: string;
    description: string;
    tags: string[];
  }) {
    this.ownerId = params.ownerId;
    this.name = params.name;
    this.description = params.description;
    this.tags = params.tags;
  }
}
