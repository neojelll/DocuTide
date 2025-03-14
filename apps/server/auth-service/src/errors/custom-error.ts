export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
