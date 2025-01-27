import { UserDto, UserLoginDto } from '@lib/user/dto'
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-up')
	async signUp(@Body(ValidationPipe) createUserDto: UserDto) {
		return this.authService.signUp(createUserDto);
	}

	@Post('sign-in')
	async signIn(@Body(ValidationPipe) signInDto: UserLoginDto) {
		return this.authService.signIn(signInDto);
	}
}
