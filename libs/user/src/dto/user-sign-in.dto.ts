import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class UserSignInDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	@MaxLength(15)
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(7)
	@MaxLength(30)
	password: string;
}
