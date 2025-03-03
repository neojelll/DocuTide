import { JwtAuthGuard, JwtDecode } from '@docu-tide/auth';
import { JwtPayload, ValidationUserUpdateDto } from '@docu-tide/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('users')
export class UserController implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    @Inject('USERS_MICROSERVICE') private readonly userClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@JwtDecode() jwtPayload: JwtPayload) {
    return await this.userService.getUser(jwtPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @JwtDecode() jwtPayload: JwtPayload,
    @Body(ValidationPipe) validationUserUpdateDto: ValidationUserUpdateDto,
  ) {
    return await this.userService.updateUser(
      jwtPayload,
      validationUserUpdateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async removeUser(
    @Res() response: Response,
    @JwtDecode() jwtPayload: JwtPayload,
  ) {
    const result = await this.userService.removeUser(jwtPayload);
    response.clearCookie(process.env['COOKIE_FILE_NAME'], {
      httpOnly: Boolean(process.env['COOKIE_HTTP_ONLY']),
    });
    return response.status(200).json({ result });
  }

  async onModuleInit() {
    this.userClient.subscribeToResponseOf(process.env['USER_GET_TOPIC']);
    this.userClient.subscribeToResponseOf(process.env['USER_UPDATE_TOPIC']);
    this.userClient.subscribeToResponseOf(process.env['USER_DELETE_TOPIC']);
    await this.userClient.connect();
  }
}
