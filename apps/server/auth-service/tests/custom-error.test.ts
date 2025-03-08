import { describe, expect, it } from 'vitest';
import { CustomError } from '../src/errors/custom-error'; // Укажите правильный путь к вашему файлу

describe('CustomError', () => {
  it('should create an instance of CustomError with correct properties', () => {
    const message = 'This is a custom error message';
    const statusCode = 404;
    const isOperational = true;

    const error = new CustomError(message, statusCode, isOperational);

    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.isOperational).toBe(isOperational);
    expect(error.name).toBe('CustomError');
    expect(error.stack).toBeDefined(); // Проверяем, что стек вызовов определен
  });

  it('should capture stack trace correctly', () => {
    const error = new CustomError('Test error', 500, false);

    // Проверяем, что стек вызовов не пустой
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('CustomError'); // Убедимся, что в стеке есть название ошибки
  });
});
