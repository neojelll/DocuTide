import { UserReadDto, UserUpdateDto } from '@lib/user/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async getUser(userId: string): Promise<Observable<UserReadDto>> {
    const result: Observable<UserReadDto> = this.usersClient.send(
      process.env.USER_GET_TOPIC,
      JSON.stringify(userId),
    );
    return result;
  }

  async updateUser(
    userId: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<Observable<string>> {
    const payload: UserUpdateDto = {
      userId,
      ...userUpdateDto,
    };

    const result: Observable<string> = this.usersClient.send(
      process.env.USER_UPDATE_TOPIC,
      JSON.stringify(payload),
    );
    return result;
  }

  async deleteUser(userId: string): Promise<Observable<string>> {
    const result: Observable<string> = this.usersClient.send(
      process.env.USER_DELETE_TOPIC,
      JSON.stringify(userId),
    );
    return result;
  }
}
