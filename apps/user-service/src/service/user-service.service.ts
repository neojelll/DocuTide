import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPostgres } from '../entities/user-postgres.entity';
import { UserMongo } from '../schemas/user-mongo.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(UserPostgres)
    private readonly postgresRepository: Repository<UserPostgres>,

    @InjectModel(UserMongo.name)
    private readonly mongoModel: Model<UserMongo>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const postgresUser = this.postgresRepository.create(createUserDto);
    const savedPostgresUser = await this.postgresRepository.save(postgresUser);

    const mongoUser = new this.mongoModel({
      ...createUserDto,
      id: savedPostgresUser.id,
    });
    await mongoUser.save();

    return savedPostgresUser;
  }

  async findOne(userId: string) {
    const user = await this.postgresRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userId);
    Object.assign(user, updateUserDto);
    await this.postgresRepository.save(user);

    await this.mongoModel.updateOne({ id: userId }, { $set: updateUserDto });

    return user;
  }

  async remove(userId: string) {
    const user = await this.findOne(userId);
    await this.postgresRepository.remove(user);
    await this.mongoModel.deleteOne({ id: userId });

    return { message: `User ${userId} deleted` };
  }
}
