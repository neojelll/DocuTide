import { CustomError } from './custom-error';

export class SignUpError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}
