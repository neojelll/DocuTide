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
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('api/v1/users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
