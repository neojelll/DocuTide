import { JwtPayload } from '@docu-tide/core';
import { UserUpdateDto } from '@docu-tide/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './app.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(process.env['USER_GET_ALL_TOPIC'])
  async handleGetAll() {
    console.log('Handling get all users request');
    const result = await this.userService.getAllUsers();
    console.debug(`Successfully retrieved ${result.length} users`);
    return result;
  }

  @MessagePattern(process.env['USER_GET_TOPIC'])
  async handleGet(@Payload() jwtPayload: JwtPayload) {
    console.log(`Handling get user request: ${jwtPayload}`);
    const result = await this.userService.getUser(jwtPayload);
    console.debug(`Successfully retrieved user: ${jwtPayload}`);
    return result;
  }

  @MessagePattern(process.env['USER_UPDATE_TOPIC'])
  async handleUpdate(@Payload() userUpdateDto: UserUpdateDto) {
    console.log(`Handling update request: ${userUpdateDto}`);
    const result = await this.userService.updateUser(userUpdateDto);
    console.debug(`Successfully updated user with ID: ${userUpdateDto}`);
    return result;
  }
}
