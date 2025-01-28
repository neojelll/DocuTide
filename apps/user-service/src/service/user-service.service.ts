import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPostgres } from '../entities/user-postgres.entity';
import { UserMongo } from '../schemas/user-mongo.schema';
import { UserDto } from 'libs/user/src/dto/user.dto';
import { UserReadDto } from 'libs/user/src/dto/user-read.dto';
import * as bcrypt from 'bcrypt';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(UserPostgres)
    private readonly postgresRepository: Repository<UserPostgres>,
    @InjectModel(UserMongo.name)
    private readonly mongoModel: Model<UserMongo>,
  ) {}

  async create(createUserDto: UserDto): Promise<UserReadDto> {
    try {
      const { password, ...otherFields } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Проверка уникальности email
      const existingUser = await this.postgresRepository.findOne({
        where: { email: otherFields.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const postgresUser = this.postgresRepository.create({
        ...otherFields,
        password: hashedPassword,
      });

      const savedUser = await this.postgresRepository.save(postgresUser);
      await this.mongoModel.create({ id: savedUser.id });

      return plainToClass(UserReadDto, classToPlain(savedUser));
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<UserReadDto[]> {
    const users = await this.postgresRepository.find();
    return users.map((user) => plainToClass(UserReadDto, classToPlain(user)));
  }

  async findOneEntity(userId: string): Promise<UserPostgres> {
    const user = await this.postgresRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(userId: string): Promise<UserReadDto> {
    const user = await this.findOneEntity(userId);
    return plainToClass(UserReadDto, classToPlain(user));
  }

  async update(userId: string, updateUserDto: UserDto): Promise<UserReadDto> {
    const user = await this.findOneEntity(userId);
    // Обновление только разрешенных полей
    const updatableFields = ['username', 'email', 'bio', 'role'];
    updatableFields.forEach((field) => {
      if (updateUserDto[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user[field] = updateUserDto[field];
      }
    });

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.postgresRepository.save(user);

    try {
      await this.mongoModel.updateOne(
        { id: userId },
        { $set: classToPlain(updateUserDto) },
        { runValidators: true },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (mongoError) {
      throw new InternalServerErrorException('Failed to update MongoDB record');
    }

    return plainToClass(UserReadDto, classToPlain(updatedUser));
  }

  async remove(userId: string): Promise<{ message: string }> {
    const user = await this.findOneEntity(userId);

    await this.postgresRepository.remove(user);

    try {
      await this.mongoModel.deleteOne({ id: userId });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (mongoError) {
      throw new InternalServerErrorException('Failed to delete MongoDB record');
    }

    return { message: `User ${userId} successfully deleted` };
  }
}
