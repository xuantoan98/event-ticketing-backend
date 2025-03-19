import { Document } from "mongoose";
export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'organizer' | 'customer';
  status: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toResponse(): IUserResponse;
  generateAuthToken(): string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}
