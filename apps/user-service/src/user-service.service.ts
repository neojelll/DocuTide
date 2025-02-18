import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserGetDto, UserSignUpDto, UserUpdateDto } from '@docu-tide/core/dtos';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: UserSignUpDto): Promise<string> {
    const newUser = new this.userModel({
      ...userData,
      hashPassword: userData.password,
    });
    return new UserGetDto(await newUser.save()).stringify();
  }

  async getAllUsers(): Promise<Promise<string>[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => {
      return new UserGetDto(user).stringify();
    });
  }

  async getUserByUserId(userId: string): Promise<string> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return new UserGetDto(user).stringify();
  }

  async getUserByUsername(username: string): Promise<string> {
    console.log('Fetching user with username:', username);
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new Error(`User with username ${username} not found.`);
    }
    return new UserGetDto(user).stringify();
  }

  async updateUser(userId: string, data: UserUpdateDto): Promise<string> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ userId }, data, { new: true })
      .exec();
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return new UserGetDto(updatedUser).stringify();
  }

  async deleteUser(userId: string): Promise<string> {
    const deletedUser = await this.userModel
      .findOneAndDelete({ userId })
      .exec();
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return `User with ID ${userId} deleted successfully.`;
  }
}
