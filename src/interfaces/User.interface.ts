import { Document, Schema } from "mongoose";
import { Gender } from "../constants/enum";
export interface IUserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: number;
  dateOfBirth?: Date;
  avatar?: string;
  address?: string;
  gender?: Gender;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  passwordChangedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  refreshTokens: string[];
  departmentId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export interface IUserCreate {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: number;
  dateOfBirth?: Date;
  avatar?: string;
  address?: string;
  gender?: Gender;
  phone?: string;
  departmentId?: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}
