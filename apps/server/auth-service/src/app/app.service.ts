import { AuthLibService } from '@docu-tide/core/auth';
import { UserGetDto, UserSignUpDto } from '@docu-tide/core/dtos';
import { User } from '@docu-tide/core/schemas';
import { Injectable } from '@nestjs/common';
import { SignUpError } from '../errors/sign-up.errors';
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

      console.log(`User successfully created: ${JSON.stringify(newUser)}`);
      return await new UserGetDto(newUser).stringify();
    } catch (error) {
      console.error(`Error signUp user: ${error.message}`);
      throw new SignUpError(`SignUp error ${error.message}`);
    }
  }

  async confirmEmail(confirmEmailToken: string) {
    const payload: { username: string; email: string } =
      await this.auth.verifyConfirmEmailToken(confirmEmailToken);
    return JSON.stringify(
      await this.user.confirmEmail(payload.username, payload.email),
    );
  }
}
