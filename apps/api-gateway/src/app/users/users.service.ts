import { UserReadDto, UserUpdateDto } from '@docu-tide/user/lib/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka
  ) {}

  async getUser(userId: string): Promise<UserReadDto> {
    const result: UserReadDto = await firstValueFrom(
      this.usersClient.send(process.env.USER_GET_TOPIC, JSON.stringify(userId))
    );

    return result;
  }

  async updateUser(
    userId: string,
    userUpdateDto: UserUpdateDto
  ): Promise<string> {
    const payload: UserUpdateDto = {
      userId,
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

  async deleteUser(userId: string): Promise<string> {
    const result: string = await firstValueFrom(
      this.usersClient.send(
        process.env.USER_DELETE_TOPIC,
        JSON.stringify(userId)
      )
    );

    return result;
  }
}
