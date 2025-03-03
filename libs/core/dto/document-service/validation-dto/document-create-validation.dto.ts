import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidationDocumentCreateDto {
  @ApiProperty({
    type: String,
    description: 'the content of the document',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
