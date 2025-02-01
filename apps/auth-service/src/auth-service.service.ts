import { UserSignUpDto } from '@lib/user/dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthServiceService {
  async getHello(userData: UserSignUpDto) {
    return userData;
  }
}
