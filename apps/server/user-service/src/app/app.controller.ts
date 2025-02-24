import { JwtPayload } from '@docu-tide/core/auth';
import { UserSignInDto, UserUpdateDto } from '@docu-tide/core/dtos';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './app.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(process.env['USER_CREATED_TOPIC'])
  handleLogin(@Payload() signInDto: UserSignInDto) {
    return this.userService.getUserByUsername(signInDto.username);
  }

  @MessagePattern(process.env['USER_GET_ALL_TOPIC'])
  handleGetAll() {
    return this.userService.getAllUsers();
  }

  @MessagePattern(process.env['USER_GET_TOPIC'])
  handleGet(@Payload() payload: JwtPayload) {
    return this.userService.getUserByUserId(payload.sub);
  }

  @MessagePattern(process.env['USER_UPDATE_TOPIC'])
  handleUpdate(@Payload() payload: UserUpdateDto) {
    return this.userService.updateUser(payload.jwtPayload.sub, payload);
  }
}
