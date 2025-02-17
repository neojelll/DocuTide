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
    return await firstValueFrom(
      this.usersClient.send(
        process.env['USER_GET_TOPIC'],
        JSON.stringify(jwtPayload),
      ),
    );
  }

  async updateUser(
    jwtPayload: JwtPayload,
    validationUserUpdateDto: ValidationUserUpdateDto,
  ): Promise<UserGetDto> {
    const userUpdateDto: UserUpdateDto = {
      jwtPayload,
      ...validationUserUpdateDto,
    };

    return await firstValueFrom(
      this.usersClient.send(
        process.env['USER_UPDATE_TOPIC'],
        JSON.stringify(userUpdateDto),
      ),
    );
  }

  async removeUser(jwtPayload: JwtPayload): Promise<string> {
    return await firstValueFrom(
      this.usersClient.send(
        process.env['USER_DELETE_TOPIC'],
        JSON.stringify(jwtPayload),
      ),
    );
  }
}
