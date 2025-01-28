import { UserDto, UserSignInDto } from '@lib/user/dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class AuthService {
	constructor(
		@Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
	) {}

	async signUp(userSignUpDto: UserDto) {
		this.authClient.emit('sign_up', JSON.stringify(userSignUpDto));
	}

	async signIn(userSignInDto: UserSignInDto) {
		this.authClient.emit('sign_in', JSON.stringify(userSignInDto));
	}
}
