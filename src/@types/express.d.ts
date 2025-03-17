import { IUserResponse } from '../interfaces/User.interface';

declare global {
  namespace Express {
    interface Response {
      json: (body?: { 
        user?: IUserResponse; 
        token?: string; 
        error?: string; 
        success?: boolean 
      }) => this;
    }
  }
}