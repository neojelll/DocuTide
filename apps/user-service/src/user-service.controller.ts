import {
  UserGetDto,
  UserUpdateDto,
  ValidationUserUpdateDto,
  UserSignInDto,
  UserSignUpDto,
} from '@docu-tide/core/dtos';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as process from 'node:process';
import { UserService } from './user-service.service';
import { JwtPayload } from '@docu-tide/core/auth';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(process.env.USER_CREATE_TOPIC || 'user.create')
  async handleRegistration(
    @Payload() userData: UserSignUpDto,
  ): Promise<string> {
    return await this.userService.createUser(userData);
  }

  @MessagePattern(process.env.USER_CREATED_TOPIC || 'user.created')
  async handleLogin(@Payload() signInDto: UserSignInDto): Promise<UserGetDto> {
    return await this.userService.getUserByUsername(signInDto.username);
  }

  @MessagePattern(process.env.USER_GET_ALL_TOPIC || 'user.get.all')
  async getAll(): Promise<UserGetDto[]> {
    return await this.userService.getAllUsers();
  }

  @MessagePattern(process.env.USER_GET_TOPIC || 'user.get')
  async handleGetUser(@Payload() jwtPayload: JwtPayload): Promise<UserGetDto> {
    return await this.userService.getUserByUserId(jwtPayload.sub);
  }

  @MessagePattern(process.env.USER_UPDATE_TOPIC || 'user.update')
  async handleUpdateUser(@Payload() payload: UserUpdateDto): Promise<string> {
    console.log('Received user update payload:', payload);
    const {
      jwtPayload,
      ...userData
    }: { jwtPayload: JwtPayload } & ValidationUserUpdateDto = payload;
    console.log(`Updating user with ID: ${jwtPayload.sub}`, userData);
    return await this.userService.updateUser(jwtPayload.sub, userData);
  }

  @MessagePattern(process.env.USER_DELETE_TOPIC || 'user.delete')
  async handleDeleteUser(@Payload() jwtPayload: JwtPayload): Promise<string> {
    return await this.userService.deleteUser(jwtPayload.sub);
  }
}
