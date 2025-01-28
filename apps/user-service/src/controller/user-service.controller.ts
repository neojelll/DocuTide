import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserServiceService } from '../service/user-service.service';
import { UserDto } from 'libs/user/src/dto/user.dto';
import { UserReadDto } from '@lib/user/dto';

@Controller('api/v1/users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  @Post('register')
  create(@Body() UserDto: UserDto) {
    return this.userService.create(UserDto);
  }

  @Get()
  findAll(): Promise<UserReadDto[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string): Promise<UserReadDto> {
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  update(@Param('userId') userId: string, @Body() UserDto: UserDto) {
    return this.userService.update(userId, UserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
