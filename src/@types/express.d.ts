import { IUserDocument } from '../interfaces/User.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}