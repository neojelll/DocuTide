import { CustomErrorInterface } from '../interfaces';

export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number, isOperational: boolean) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }

  stringify(): CustomErrorInterface {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
    };
  }
}
