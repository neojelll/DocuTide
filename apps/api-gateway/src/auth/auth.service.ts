import { UserSignInDto, UserSignUpDto } from '@lib/user/dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class AuthService {
	constructor(
		@Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
	) {}

	async signUp(userSignUpDto: UserSignUpDto) {
		const result = this.authClient.send(process.env.USER_CREATE_TOPIC, JSON.stringify(userSignUpDto));
		return result;
	}

	async signIn(userSignInDto: UserSignInDto) {
		const result = this.authClient.send(process.env.USER_CREATED_TOPIC, JSON.stringify(userSignInDto));
		return result;
	}
}
