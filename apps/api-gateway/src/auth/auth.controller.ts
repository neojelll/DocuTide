import { UserSignInDto, UserSignUpDto } from '@lib/user/dto'
import { Body, Controller, Inject, OnModuleInit, Post, ValidationPipe } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController implements OnModuleInit {
	constructor(
		private readonly authService: AuthService,
		@Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
	) {}

	@Post('sign-up')
	async signUp(@Body(ValidationPipe) userSignUpDto: UserSignUpDto): Promise<Observable<string>> {
		return await this.authService.signUp(userSignUpDto);
	}

	@Post('sign-in')
	async signIn(@Body(ValidationPipe) userSignInDto: UserSignInDto): Promise<Observable<string>> {
		return await this.authService.signIn(userSignInDto);
	}

	async onModuleInit() {
		this.authClient.subscribeToResponseOf(process.env.USER_CREATE_TOPIC || 'user.create');
		this.authClient.subscribeToResponseOf(process.env.USER_CREATED_TOPIC || 'user.created');
		await this.authClient.connect();
	}
}
