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
  toResponse(): IUserResponse;
  generateAuthToken(): string;
  refreshTokens: string[];
  departmentId: Schema.Types.ObjectId;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  dateOfBirth?: Date;
  avatar?: string;
  address?: string;
  gender?: Gender;
  phone?: string;
  createdAt: string;
}
