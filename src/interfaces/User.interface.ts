import { Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'organizer' | 'customer';
  createAt: Date;
  updateAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toResponse(): IUserResponse;
  generateAuthToken(): string;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  role?: 'organizer' | 'customer';
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}