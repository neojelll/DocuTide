import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ProjectCreateDto {
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty({ message: 'Name is required'})
	@MinLength(1, { message: 'Name must be at least 1 character long' })
	@MaxLength(30, { message: 'Name cannot exceed 30 characters' })
	@ApiProperty({
		type: String,
		minLength: 1,
    maxLength: 30,
		description: 'The name of the project, must be between 1 and 30 characters long and should be unique.',
	})
	name: string;

	@IsString({ message: 'About must be a string' })
	@MaxLength(500, { message: 'About cannot exceed 500 characters' })
	@ApiPropertyOptional({
		type: String,
		maxLength: 500,
		description: 'A brief description of the project, maximum 500 characters.',
		default: '',
	})
	about?: string;
}
