import { UserReadDto, UserSignInDto, UserSignUpDto } from '@lib/user/dto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<Observable<string>> {
    const salt = await bcrypt.genSalt();
    userSignUpDto.password = await bcrypt.hash(userSignUpDto.password, salt);

    const result: Observable<string> = this.authClient.send(
      process.env.USER_CREATE_TOPIC,
      JSON.stringify(userSignUpDto),
    );

    return result;
  }

  async signIn(userSignInDto: UserSignInDto): Promise<string> {
    const user: Observable<UserReadDto> = this.authClient.send(
      process.env.USER_CREATED_TOPIC,
      JSON.stringify(userSignInDto),
    );

    if (
      !Object(user).userId ||
      !(await bcrypt.compare(userSignInDto.password, Object(user).password))
    ) {
      throw new UnauthorizedException();
    }

    return await this.generateAccessToken(
      userSignInDto.username,
      String(Object(user).userId),
    );
  }

  async generateAccessToken(username: string, userId: string): Promise<any> {
    const payload: JwtPayload = {
      sub: userId,
      username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
