import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class UserReadDto {
	@IsNumber()
	@IsNotEmpty()
	userId: number;

	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	@MaxLength(15)
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@MaxLength(500)
	bio?: string;

	@IsString()
	@MaxLength(50)
	role?: string;

	@IsDate()
	@IsNotEmpty()
	createdAt: Date;

	@IsDate()
	@IsNotEmpty()
	updatedAt: Date;
}
