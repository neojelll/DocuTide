import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../src/app/app.service';
import { UserController } from '../src/app/app.controller';

describe('UserController', () => {
  let controller: UserController;
  let serviceMock: any;

  beforeEach(async () => {
    serviceMock = {
      getAllUsers: vi.fn(),
      getUser: vi.fn(),
      updateUser: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('handleGetAll', () => {
    it('should return result from getAllUsers', async () => {
      const mockResult = [
        JSON.stringify({
          userId: 'cuid12345678901234567890',
          email: 'alice@example.com',
          emailConfirmed: true,
          username: 'alice123',
          hashPassword:
            '$2b$10$hashedpassword123456789012345678901234567890123456789',
          biography: 'Loves coding and coffee',
          role: 'admin',
          notificationsEnabled: true,
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-02T12:00:00Z'),
        }),
        JSON.stringify({
          userId: 'cuid22345678901234567890',
          email: 'bob@example.com',
          emailConfirmed: false,
          username: 'bobsmith',
          hashPassword:
            '$2b$10$hashedpassword223456789012345678901234567890123456789',
          biography: null,
          role: 'user',
          notificationsEnabled: false,
          createdAt: new Date('2023-02-01T14:30:00Z'),
          updatedAt: new Date('2023-02-01T14:30:00Z'),
        }),
      ];
      serviceMock.getAllUsers.mockResolvedValue(mockResult);

      const result = await controller.handleGetAll();

      expect(result).toBe(mockResult);
      expect(serviceMock.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should throw error if getAllUsers fails', async () => {
      const error = new Error('Service error');
      serviceMock.getAllUsers.mockRejectedValue(error);

      await expect(controller.handleGetAll()).rejects.toThrow('Service error');
    });
  });

  describe('handleGet', () => {
    it('should return result from getUser', async () => {
      const jwtPayload = {
        sub: 'cuid12345678901234567890',
        username: 'alice123',
        email: 'alice@example.com',
      };
      const mockResult = JSON.stringify({
        userId: 'cuid12345678901234567890',
        email: 'alice@example.com',
        emailConfirmed: true,
        username: 'alice123',
        hashPassword:
          '$2b$10$hashedpassword123456789012345678901234567890123456789',
        biography: 'Loves coding and coffee',
        role: 'admin',
        notificationsEnabled: true,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T12:00:00Z'),
      });
      serviceMock.getUser.mockResolvedValue(mockResult);

      const result = await controller.handleGet(jwtPayload);

      expect(result).toBe(mockResult);
      expect(serviceMock.getUser).toHaveBeenCalledWith(jwtPayload);
    });

    it('should throw error if getUser fails', async () => {
      const jwtPayload = {
        sub: 'cuid12345678901234567890',
        username: 'alice123',
        email: 'alice@example.com',
      };
      const error = new Error('Service error');
      serviceMock.getUser.mockRejectedValue(error);

      await expect(controller.handleGet(jwtPayload)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('handleUpdate', () => {
    it('should return result from updateUser', async () => {
      const userUpdateDto = {
        jwtPayload: {
          sub: 'cuid12345678901234567890',
          username: 'alice123',
          email: 'alice@example.com',
        },
        username: 'alice_new',
        email: 'alice_new@example.com',
      };
      const mockResult = JSON.stringify({
        userId: 'cuid12345678901234567890',
        email: 'alice_new@example.com',
        emailConfirmed: true,
        username: 'alice_new',
        hashPassword:
          '$2b$10$hashedpassword123456789012345678901234567890123456789',
        biography: 'Loves coding and coffee',
        role: 'admin',
        notificationsEnabled: true,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T12:00:00Z'),
      });
      serviceMock.updateUser.mockResolvedValue(mockResult);

      const result = await controller.handleUpdate(userUpdateDto);

      expect(result).toBe(mockResult);
      expect(serviceMock.updateUser).toHaveBeenCalledWith(userUpdateDto);
    });

    it('should throw error if updateUser fails', async () => {
      const userUpdateDto = {
        jwtPayload: {
          sub: 'cuid12345678901234567890',
          username: 'alice123',
          email: 'alice@example.com',
        },
        username: 'alice_new',
      };
      const error = new Error('Service error');
      serviceMock.updateUser.mockRejectedValue(error);

      await expect(controller.handleUpdate(userUpdateDto)).rejects.toThrow(
        'Service error',
      );
    });
  });
});
