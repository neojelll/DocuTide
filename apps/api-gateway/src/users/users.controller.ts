import { UserDto } from '@lib/user/dto'
import { Body, Controller, Delete, Get, Param, Patch, ValidationPipe } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return await this.usersService.getUser(userId);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body(ValidationPipe) userUpdateDto: UserDto) {
    return await this.usersService.updateUser(userId, userUpdateDto);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.usersService.deleteUser(userId);
  }
}
