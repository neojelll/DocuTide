import { UserReadDto, UserUpdateDto } from '@docu-tide/user/lib/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtPayload } from '../auth/interfaces/jwt.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka
  ) {}

  async getUser(user: JwtPayload): Promise<UserReadDto> {
    const result: UserReadDto = await firstValueFrom(
      this.usersClient.send(process.env.USER_GET_TOPIC, JSON.stringify(user))
    );

    return result;
  }

  async updateUser(
    user: JwtPayload,
    userUpdateDto: UserUpdateDto
  ): Promise<string> {
    const payload: UserUpdateDto = {
      userId: user.sub,
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

  async deleteUser(user: JwtPayload): Promise<string> {
    const result: string = await firstValueFrom(
      this.usersClient.send(process.env.USER_DELETE_TOPIC, JSON.stringify(user))
    );

    return result;
  }
}
