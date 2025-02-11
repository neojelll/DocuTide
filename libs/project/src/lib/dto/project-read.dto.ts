import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProjectReadDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier of the project',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the project',
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

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the project owner (maintainer)',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  ownerId: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Tags associated with the project',
    type: [String],
    example: ['opensource', 'tech', 'Postgres-hot-leaks'],
  })
  tags: string[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Timestamp when the project was created',
    type: String,
    example: '2025-02-06T12:00:00Z',
  })
  createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Timestamp when the project was last updated',
    type: String,
    example: '2025-02-06T12:00:00Z',
  })
  updatedAt: string;
}
