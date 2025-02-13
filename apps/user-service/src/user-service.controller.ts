import {
  UserSignInDto,
  UserSignUpDto,
  UserUpdateDto,
} from '@docu-tide/user/lib/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as process from 'node:process';
import { UserService } from './user-service.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(process.env.USER_CREATE_TOPIC || 'user.create')
  async handleRegistration(@Payload() userData: UserSignUpDto) {
    return await this.userService.createUser(userData);
  }

  @MessagePattern(process.env.USER_CREATED_TOPIC || 'user.created')
  async handleLogin(@Payload() signInDto: UserSignInDto) {
    return await this.userService.getUserByUsername(signInDto.username);
  }

  @MessagePattern(process.env.USER_GET_ALL_TOPIC || 'user.get.all')
  async getAll() {
    return await this.userService.getAllUsers();
  }

  @MessagePattern(process.env.USER_GET_TOPIC || 'user.get')
  async handleGetUserById(@Payload() userId: string) {
    return await this.userService.getUserByUserId(userId);
  }

  @MessagePattern(process.env.USER_UPDATE_TOPIC || 'user.update')
  async handleUpdateUser(
    @Payload() payload: { userId: string; data: UserUpdateDto },
  ) {
    return await this.userService.updateUser(payload.userId, payload.data);
  }

  @MessagePattern(process.env.USER_DELETE_TOPIC || 'user.delete')
  async handleDeleteUser(@Payload() userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
