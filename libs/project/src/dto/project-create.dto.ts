import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class ProjectCreateDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	name: string;

	@IsString()
	@MaxLength(500)
	about?: string;
}
