import { CustomError } from './custom-error';

export class ConfirmEmailError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}
