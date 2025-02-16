import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ValidationProjectUpdateDto {
  @ApiPropertyOptional({
    type: String,
    description: 'the name of the project',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  newProjectname?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'the description of the project',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
