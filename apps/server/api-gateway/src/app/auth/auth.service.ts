import { AuthLibService } from '@docu-tide/auth';
import { UserSignInDto, UserSignUpDto } from '@docu-tide/core';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly auth: AuthLibService,
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<string | undefined> {
    return await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_SIGN_UP_TOPIC'],
        JSON.stringify(userSignUpDto),
      ),
    );
  }

  async confirmEmail(confirmEmailToken: string) {
    return await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_CONFIRM_EMAIL_TOPIC'],
        confirmEmailToken,
      ),
    );
  }

  async signIn(userSignInDto: UserSignInDto) {
    return await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_SIGN_IN_TOPIC'],
        JSON.stringify(userSignInDto),
      ),
    );
  }

  async signOut(token: string) {
    return await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_SIGN_OUT_TOPIC'],
        JSON.stringify(token),
      ),
    );
  }
}
