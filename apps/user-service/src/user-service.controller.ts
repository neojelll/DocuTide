import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user-service.service';
import { UserSignInDto } from '@lib/user/dto/user-sign-in.dto';
import { UserSignUpDto } from '@lib/user/dto/user-sign-up.dto';
import { UserUpdateDto } from '@lib/user/dto/user-update.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(process.env.USER_CREATE_TOPIC)
  async handleRegistration(@Payload() userData: UserSignUpDto) {
    return await this.userService.createUser(userData);
  }

  @MessagePattern(process.env.USER_CREATED_TOPIC)
  async handleLogin(@Payload() signInDto: UserSignInDto) {
    return await this.userService.getUserByUsername(signInDto.username);
  }

  @MessagePattern(process.env.USER_GET_TOPIC)
  async handleGetUser(@Payload() userId: string) {
    return await this.userService.getUserByUserId(userId);
  }

  @MessagePattern(process.env.USER_UPDATE_TOPIC)
  async handleUpdateUser(
    @Payload() payload: { userId: string; data: UserUpdateDto },
  ) {
    return await this.userService.updateUser(payload.userId, payload.data);
  }

  @MessagePattern(process.env.USER_DELETE_TOPIC)
  async handleDeleteUser(@Payload() userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
