import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'user documentation',
    type: String,
  })
  content: string;
}
