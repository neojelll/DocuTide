import { UserSignInDto, UserSignUpDto } from '@lib/user/dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Observable } from 'rxjs'

@Injectable()
export class AuthService {
	constructor(
		@Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
	) {}

	async signUp(userSignUpDto: UserSignUpDto) {
    return this.authClient.send(
			process.env.USER_CREATE_TOPIC || 'user_create',
			JSON.stringify(userSignUpDto)
		).toPromise();
  }

	async signIn(userSignInDto: UserSignInDto) {
		const result: Observable<string> = this.authClient.send(process.env.USER_CREATED_TOPIC, JSON.stringify(userSignInDto));
		return result;
	}
}
