import { CustomError } from './custom.error';

export class MailCreateTransporterError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}

export class MailSendError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}
