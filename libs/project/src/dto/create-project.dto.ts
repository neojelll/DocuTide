import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateProjectDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	name: string;

	@IsString()
	about?: string;
}
