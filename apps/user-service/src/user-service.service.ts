import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UserSignUpDto } from '@lib/user/dto/user-sign-up.dto';
import { UserUpdateDto } from '@lib/user/dto/user-update-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async createUser(userData: UserSignUpDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return user;
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.userModel.findOne({ id: userId }).exec();
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return user;
  }


  async updateUser(userId: string, updateDto: UserUpdateDto): Promise<any> {
    const updatedUser = await this.userModel.findOneAndUpdate(
        { id: userId },
        updateDto,
        { new: true },
    ).exec();

    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return updatedUser;
  }


  async deleteUser(userId: string): Promise<any> {
    const deletedUser = await this.userModel.findOneAndDelete({ id: userId }).exec();
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return `User with ID ${userId} deleted successfully.`;
  }
}
