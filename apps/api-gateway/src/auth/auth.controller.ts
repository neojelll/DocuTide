import { UserDto, UserSignInDto } from '@lib/user/dto'
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-up')
	async signUp(@Body(ValidationPipe) userSignUpDto: UserDto) {
		await this.authService.signUp(userSignUpDto);
	}

	@Post('sign-in')
	async signIn(@Body(ValidationPipe) userSignInDto: UserSignInDto) {
		await this.authService.signIn(userSignInDto);
	}
}
