import { JwtPayload } from '@docu-tide/core/auth';
import {
  UserGetDto,
  UserUpdateDto,
  ValidationUserUpdateDto,
} from '@docu-tide/core/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async getUser(jwtPayload: JwtPayload): Promise<UserGetDto> {
    const result: UserGetDto = await firstValueFrom(
      this.usersClient.send(
        process.env['USER_GET_TOPIC'],
        JSON.stringify(jwtPayload),
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
