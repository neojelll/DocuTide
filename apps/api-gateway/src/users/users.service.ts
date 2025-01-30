import { UserUpdateDto } from '@lib/user/dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async getUser(userId: string) {
    const result = this.usersClient.send(process.env.USER_GET_TOPIC, JSON.stringify(userId));
    return result;
  }

  async updateUser(userId: string, userUpdateDto: UserUpdateDto) {
    const payload = {
      userId,
      ...userUpdateDto,
    }

    const result = this.usersClient.send(process.env.USER_UPDATE_TOPIC, JSON.stringify(payload));
    return result;
  }

  async deleteUser(userId: string) {
    const result = this.usersClient.send(process.env.USER_DELETE_TOPIC, JSON.stringify(userId));
    return result;
  }
}
