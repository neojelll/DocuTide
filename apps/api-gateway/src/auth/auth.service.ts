import { UserReadDto, UserSignInDto, UserSignUpDto } from '@lib/user/dto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<string> {
    const salt = await bcrypt.genSalt();
    userSignUpDto.password = await bcrypt.hash(userSignUpDto.password, salt);

    const result: string = await firstValueFrom(
      this.authClient.send(
        process.env.USER_CREATE_TOPIC,
        JSON.stringify(userSignUpDto),
      ),
    );

    return result;
  }

  async signIn(userSignInDto: UserSignInDto) {
    const user: UserReadDto = await firstValueFrom(
      this.authClient.send(
        process.env.USER_CREATED_TOPIC,
        JSON.stringify(userSignInDto),
      ),
    );

    if (
      !user.userId ||
      !(await bcrypt.compare(userSignInDto.password, user.hashPassword))
    ) {
      throw new UnauthorizedException('Uncorrect password');
    }

    return await this.generateAccessToken(userSignInDto.username, user.userId);
  }

  async generateAccessToken(username: string, userId: string): Promise<any> {
    const payload: JwtPayload = {
      sub: userId,
      username,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
