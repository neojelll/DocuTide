import { UserReadDto, UserUpdateDto } from '@docu-tide/user/lib/dto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtPayload } from '../auth/interfaces/jwt.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka,
    private readonly jwtService: JwtService
  ) {}

  async getUser(request: Request, username: string): Promise<UserReadDto> {
    const jwt = request.headers['authorization'].split(' ')[1];
    const decodedJwt: JwtPayload = this.jwtService.decode(jwt);

    const payload = {
      ...decodedJwt,
      username,
    };

    const result: UserReadDto = await firstValueFrom(
      this.usersClient.send(process.env.USER_GET_TOPIC, JSON.stringify(payload))
    );

    return result;
  }

  async updateUser(
    request: Request,
    userUpdateDto: UserUpdateDto
  ): Promise<string> {
    const jwt = request.headers['authorization'].split(' ')[1];
    const decodedJwt: JwtPayload = this.jwtService.decode(jwt);

    const payload: UserUpdateDto = {
      ...decodedJwt,
      ...userUpdateDto,
    };

    const result: string = await firstValueFrom(
      this.usersClient.send(
        process.env.USER_UPDATE_TOPIC,
        JSON.stringify(payload)
      )
    );

    return result;
  }

  async deleteUser(request: Request): Promise<string> {
    const jwt = request.headers['authorization'].split(' ')[1];
    const decodedJwt: JwtPayload = this.jwtService.decode(jwt);

    const result: string = await firstValueFrom(
      this.usersClient.send(
        process.env.USER_DELETE_TOPIC,
        JSON.stringify(decodedJwt)
      )
    );

    return result;
  }
}
