import { IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
	@IsString()
	@MinLength(5)
	@MaxLength(15)
	username: string;
}
