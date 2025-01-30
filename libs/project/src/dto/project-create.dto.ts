import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ProjectCreateDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(30)
	@ApiProperty({
		description: 'The name of the project, must be between 1 and 30 characters long.',
		type: String,
		minLength: 1,
    maxLength: 30,
	})
	name: string;

	@IsString()
	@MaxLength(500)
	@ApiPropertyOptional({
		description: 'A brief description of the project, maximum 500 characters.',
		type: String,
		maxLength: 500,
		default: '',
	})
	about?: string;
}
