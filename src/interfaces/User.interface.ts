import { Document } from "mongoose";
export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'organizer' | 'customer';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toResponse(): IUserResponse;
  generateAuthToken(): string;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'organizer' | 'customer';
}

export interface IUserUpdate {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  updatedAt: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}
