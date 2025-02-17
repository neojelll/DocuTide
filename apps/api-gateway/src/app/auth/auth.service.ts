import { AuthLibService, JwtPayload } from '@docu-tide/core/auth';
import { UserGetDto, UserSignInDto, UserSignUpDto } from '@docu-tide/core/dtos';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import * as bcryptjs from 'bcryptjs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly authLibService: AuthLibService,
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<string> {
    const salt = await bcryptjs.genSalt();
    userSignUpDto.password = await bcryptjs.hash(userSignUpDto.password, salt);

    const result: string = await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_SIGN_UP_TOPIC'],
        JSON.stringify(userSignUpDto),
      ),
    );

    return result;
  }

  async signIn(response, userSignInDto: UserSignInDto) {
    const user: UserGetDto = await firstValueFrom(
      this.authClient.send(
        process.env['AUTH_SIGN_IN_TOPIC'],
        JSON.stringify(userSignInDto),
      ),
    );

    if (
      !user.userId ||
      !(await bcryptjs.compare(userSignInDto.password, user.hashPassword))
    ) {
      throw new UnauthorizedException('Uncorrect password');
    }

    const jwtPayload: JwtPayload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
    };

    const token = await this.authLibService.createAccessToken(jwtPayload);

    response.cookie('jwt', token.access_token, {
      httpOnly: true,
    });

    return 'success';
  }
}
