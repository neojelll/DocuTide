import { describe, it, beforeAll, afterEach, afterAll, expect } from 'vitest';
import { UserController } from '../src/app/app.controller';
import { UserService } from '../src/app/app.service';
import {
  JwtPayload,
  UserUpdateDto,
  DatabaseGetError,
  DatabaseUpdateError,
  PrismaClient,
  PrismaService,
  UserRepository,
} from '@docu-tide/core';

describe('UserController Tests', () => {
  let userController: UserController;
  let userService: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.POSTGRES_URL } },
    });
    userService = new UserService(new UserRepository(prisma));
    userController = new UserController(userService);
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('handleGetAll', () => {
    it('should return an empty array when no users exist', async () => {
      const result = await userController.handleGetAll();
      expect(result).toEqual([]);
    });

    it('should return all users as stringified DTOs', async () => {
      await prisma.user.createMany({
        data: [
          {
            userId: '1',
            email: 'test1@example.com',
            username: 'test1',
            hashPassword: 'hash1',
          },
          {
            userId: '2',
            email: 'test2@example.com',
            username: 'test2',
            hashPassword: 'hash2',
          },
        ],
      });

      const result = await userController.handleGetAll();
      expect(result).toHaveLength(2);
      expect(JSON.parse(result[0])).toMatchObject({
        userId: '1',
        email: 'test1@example.com',
        username: 'test1',
        hashPassword: 'hash1',
      });
      expect(JSON.parse(result[1])).toMatchObject({
        userId: '2',
        email: 'test2@example.com',
        username: 'test2',
        hashPassword: 'hash2',
      });
    });
  });

  describe('handleGet', () => {
    it('should return the user DTO when the user exists', async () => {
      const jwtPayload: JwtPayload = {
        sub: '1',
        username: 'test',
        email: 'test@example.com',
      };
      await prisma.user.create({
        data: {
          userId: '1',
          email: 'test@example.com',
          username: 'test',
          hashPassword: 'hash',
        },
      });

      const result = await userController.handleGet(jwtPayload);
      expect(JSON.parse(result)).toMatchObject({
        userId: '1',
        email: 'test@example.com',
        username: 'test',
      });
    });

    it('should throw DatabaseGetError when the user does not exist', async () => {
      const jwtPayload: JwtPayload = {
        sub: '999',
        username: 'test',
        email: 'test@example.com',
      };
      await expect(userController.handleGet(jwtPayload)).rejects.toThrow(
        DatabaseGetError,
      );
    });
  });

  describe('handleUpdate', () => {
    it('should update and return the updated user DTO', async () => {
      const jwtPayload: JwtPayload = {
        sub: '1',
        username: 'test',
        email: 'test@example.com',
      };
      await prisma.user.create({
        data: {
          userId: '1',
          email: 'old@example.com',
          username: 'old',
          hashPassword: 'hash',
        },
      });

      const updateDto: UserUpdateDto = {
        jwtPayload,
        email: 'new@example.com',
        username: 'new',
      };
      const result = await userController.handleUpdate(updateDto);
      expect(JSON.parse(result)).toMatchObject({
        userId: '1',
        email: 'new@example.com',
        username: 'new',
      });
    });

    it('should throw DatabaseUpdateError when updating a non-existing user', async () => {
      const updateDto: UserUpdateDto = {
        jwtPayload: { sub: '999', username: 'test', email: 'test@example.com' },
        email: 'new@example.com',
      };
      await expect(userController.handleUpdate(updateDto)).rejects.toThrow(
        DatabaseUpdateError,
      );
    });

    it('should throw DatabaseUpdateError when user data is invalid', async () => {
      const updateDto: UserUpdateDto = {
        jwtPayload: {
          sub: '1',
          username: 'invalid',
          email: 'invalid@example.com',
        },
        email: '',
        username: '',
      };
      await expect(userController.handleUpdate(updateDto)).rejects.toThrow(
        DatabaseUpdateError,
      );
    });
  });
});
