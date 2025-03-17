import User from "../models/User.model";
import { IUserCreate, IUserResponse, IUserDocument } from "../interfaces/User.interface";
import { Types } from "mongoose";

export class UserService {
  async createUser(userData: IUserCreate): Promise<IUserDocument> {
    const user = await User.create(userData);
    return user;
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({email});
  }

  async getUserById(userId: string): Promise<IUserDocument | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return User.findById(userId);
  }
}