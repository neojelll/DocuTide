import { AuthLibService } from '@docu-tide/auth';
import {
  User,
  UserGetDto,
  UserSignInDto,
  UserSignUpDto,
} from '@docu-tide/core';
import { Injectable } from '@nestjs/common';
import { ConfirmEmailError } from '../errors/confirm-email.errors';
import { SignUpError } from '../errors/sign-up.errors';
import { ConfirmEmailTokenPayload } from '../interfaces/email-token.interface';
import { UserExists } from '../interfaces/user-exists.interface';
import { MailService } from './mail/mail.service';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly auth: AuthLibService,
    private readonly user: UserRepository,
    private readonly mail: MailService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<string | UserExists> {
    try {
      console.log(`Started signUp user: ${userSignUpDto.username}`);

      const checkUser: UserExists | null = await this.user.checkUser(
        userSignUpDto,
      );
      if (checkUser !== null) {
        console.log(`Error signUp user: ${checkUser.message}`);
        return checkUser;
      }

      const confirmEmailToken = await this.auth.createConfirmEmailToken(
        userSignUpDto.username,
        userSignUpDto.email,
      );

      await this.mail.sendMail(userSignUpDto.email, confirmEmailToken);

      const hashPassword: string = await this.auth.hashPassword(
        userSignUpDto.password,
      );
      const newUser: User = await this.user.createUser(
        userSignUpDto,
        hashPassword,
      );

      console.log(`Successfully signUp: ${JSON.stringify(newUser)}`);
      return await new UserGetDto(newUser).stringify();
    } catch (error) {
      console.error(`Error signUp user: ${error.message}`);
      throw new SignUpError(`SignUp error ${error.message}`);
    }
  }

  async confirmEmail(confirmEmailToken: string): Promise<string> {
    try {
      const payload: ConfirmEmailTokenPayload =
        await this.auth.verifyConfirmEmailToken(confirmEmailToken);

      console.log(`Start confirm email: ${payload.email}`);

      const updateUser: User = await this.user.confirmEmail(
        payload.username,
        payload.email,
      );

      console.log(`Successfully confirm email: ${JSON.stringify(updateUser)}`);
      return new UserGetDto(updateUser).stringify();
    } catch (error) {
      console.error(`Error when confirm email: ${error.message}`);
      throw new ConfirmEmailError(`Error when confirm email: ${error.message}`);
    }
  }

  async signIn(userSignInDto: UserSignInDto) {
    const user: User = await this.user.getUser(userSignInDto.username);
    return user;
  }
}
