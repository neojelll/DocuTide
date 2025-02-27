import { CustomError } from './custom-error';

export class DatabaseCreateError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}

export class DatabaseCheckError extends CustomError {
  constructor(message: string) {
    super(message, 500, false);
  }
}
