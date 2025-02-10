import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DocsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'user documentation',
    type: String,
  })
  content: string;

  constructor(params: { content: string }) {
    this.content = params.content;
  }
}
