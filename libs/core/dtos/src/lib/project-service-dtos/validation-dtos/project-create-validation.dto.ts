import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ValidationProjectCreateDto {
  @ApiProperty({
    type: String,
    description: 'the name of the project',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  projectname: string;

  @ApiPropertyOptional({
    type: String,
    description: 'the description of the project',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;
}
