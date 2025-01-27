import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(7)
	@MaxLength(30)
	password: string;
}
