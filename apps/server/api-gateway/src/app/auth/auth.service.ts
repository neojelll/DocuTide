import { AuthLibService } from '@docu-tide/core/auth';
import { UserGetDto, UserSignInDto, UserSignUpDto } from '@docu-tide/core/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly authLibService: AuthLibService,
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<string> {
    userSignUpDto.password = await this.authLibService.hashPassword(
      userSignUpDto.password,
    );

    return await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_SIGN_UP_TOPIC'],
        JSON.stringify(userSignUpDto),
      ),
    );
  }

  async signIn(userSignInDto: UserSignInDto): Promise<string> {
    const userGetDto: UserGetDto = await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_SIGN_IN_TOPIC'],
        JSON.stringify(userSignInDto),
      ),
    );
    await this.authLibService.verifyPassword(
      userGetDto.userId,
      userSignInDto.password,
      userGetDto.hashPassword,
    );
    return await this.authLibService.createAccessToken(
      userGetDto.userId,
      userGetDto.username,
      userGetDto.email,
    );
  }
}
