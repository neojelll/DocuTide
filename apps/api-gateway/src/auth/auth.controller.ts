import { UserSignInDto, UserSignUpDto } from '@lib/user/dto'
import { Body, Controller, Inject, OnModuleInit, Post, ValidationPipe } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController implements OnModuleInit {
	constructor(
		private readonly authService: AuthService,
		@Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
	) {}

	async onModuleInit() {
    this.authClient.subscribeToResponseOf('user_create');
		await this.authClient.connect();
  }

	@Post('sign-up')
	async signUp(@Body(ValidationPipe) userSignUpDto: UserSignUpDto) {
		console.log('signUp method called with:', userSignUpDto);
		return await this.authService.signUp(userSignUpDto);
	}

	@Post('sign-in')
	async signIn(@Body(ValidationPipe) userSignInDto: UserSignInDto) {
		await this.authService.signIn(userSignInDto);
	}
}
