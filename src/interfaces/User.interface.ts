import { Document } from "mongoose";
import { Gender } from "../constants/enum";
export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'organizer' | 'customer';
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
