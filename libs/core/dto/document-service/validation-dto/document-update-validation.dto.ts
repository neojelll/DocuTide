import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ValidationDocumentUpdateDto {
  @ApiPropertyOptional({
    type: String,
    description: 'new document content',
  })
  @IsString()
  @IsOptional()
  content?: string;
}
