import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as process from 'node:process';
import { UserService } from './user-service.service';
import { JwtPayload } from '@docu-tide/core/auth';
import {
  UserSignInDto,
  UserSignUpDto,
  UserUpdateDto,
} from '@docu-tide/core/dtos';

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
  async handleGetUserByUserId(@Payload() payload: JwtPayload) {
    return await this.userService.getUserByUserId(payload.sub);
  }

  @MessagePattern(process.env.USER_UPDATE_TOPIC || 'user.update')
  async handleUpdateUser(@Payload() payload: UserUpdateDto) {
    const { ...userData } = payload;
    return await this.userService.updateUser(payload.jwtPayload.sub, userData);
  }

  @MessagePattern(process.env.USER_DELETE_TOPIC || 'user.delete')
  async handleDeleteUser(@Payload() user: JwtPayload) {
    return await this.userService.deleteUser(user.sub);
  }
}
