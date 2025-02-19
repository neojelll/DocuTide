import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserGetDto, UserSignUpDto, UserUpdateDto } from '@docu-tide/core/dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(data: UserSignUpDto): Promise<string> {
    const user = new this.userModel({ ...data, hashPassword: data.password });
    return new UserGetDto(await user.save()).stringify();
  }

  async getAllUsers(): Promise<string[]> {
    const users = await this.userModel.find().exec();
    return Promise.all(
      users.map(async (user) => new UserGetDto(user).stringify()),
    );
  }

  async getUserByUserId(userId: string): Promise<string> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user)
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    return new UserGetDto(user).stringify();
  }

  async getUserByUsername(username: string): Promise<string> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException(`User "${username}" not found.`);
    return new UserGetDto(user).stringify();
  }

  async updateUser(userId: string, data: UserUpdateDto): Promise<string> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ userId }, data, { new: true })
      .exec();
    if (!updatedUser)
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    return new UserGetDto(updatedUser).stringify();
  }

  async removeUser(userId: string): Promise<string> {
    const deletedUser = await this.userModel
      .findOneAndDelete({ userId })
      .exec();
    if (!deletedUser)
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    return `User with ID ${userId} deleted successfully.`;
  }
}
