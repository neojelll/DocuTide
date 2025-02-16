import { JwtPayload } from '@docu-tide/core/auth';
import {
  UserReadDto,
  UserUpdateDto,
  ValidationUserUpdateDto,
} from '@docu-tide/user';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async getUser(user: JwtPayload): Promise<UserReadDto> {
    const result: UserReadDto = await firstValueFrom(
      this.usersClient.send(
        process.env['USER_GET_TOPIC'],
        JSON.stringify(user),
      ),
    );

    return result;
  }

  async updateUser(
    jwtPayload: JwtPayload,
    validationUserUpdateDto: ValidationUserUpdateDto,
  ): Promise<string> {
    const userUpdateDto: UserUpdateDto = {
      jwtPayload,
      ...validationUserUpdateDto,
    };

    const result: string = await firstValueFrom(
      this.usersClient.send(
        process.env['USER_UPDATE_TOPIC'],
        JSON.stringify(userUpdateDto),
      ),
    );

    return result;
  }

  async deleteUser(user: JwtPayload): Promise<string> {
    const result: string = await firstValueFrom(
      this.usersClient.send(
        process.env['USER_DELETE_TOPIC'],
        JSON.stringify(user),
      ),
    );

    return result;
  }
}
