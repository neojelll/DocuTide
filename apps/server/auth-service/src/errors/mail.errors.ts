import { CustomError } from './custom-error';

export class CreateMailTransporterError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}

export class SendMailError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}
