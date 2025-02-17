import { JwtAuthGuard, JwtDecode, JwtPayload } from '@docu-tide/core/auth';
import { ValidationUserUpdateDto } from '@docu-tide/core/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@JwtDecode() jwtPayload: JwtPayload) {
    return await this.usersService.getUser(jwtPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @JwtDecode() jwtPayload: JwtPayload,
    @Body(ValidationPipe) validationUserUpdateDto: ValidationUserUpdateDto,
  ) {
    return await this.usersService.updateUser(
      jwtPayload,
      validationUserUpdateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async removeUser(@JwtDecode() jwtPayload: JwtPayload) {
    return await this.usersService.removeUser(jwtPayload);
  }

  async onModuleInit() {
    this.usersClient.subscribeToResponseOf(process.env['USER_GET_TOPIC']);
    this.usersClient.subscribeToResponseOf(process.env['USER_UPDATE_TOPIC']);
    this.usersClient.subscribeToResponseOf(process.env['USER_DELETE_TOPIC']);
    await this.usersClient.connect();
  }
}
