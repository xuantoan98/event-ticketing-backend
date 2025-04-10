import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDocument } from '../interfaces/User.interface';
import { UserService } from '../services';
import { formatResponse } from '../utils/response.util';

const userService = new UserService();

declare module 'express' {
  interface Request {
    user?: IUserDocument
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {  
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) {
    return res.status(401).json(
      formatResponse(
        'error',
        'Unauthorized'
      )
    )
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string };
    const user = await userService.getUserById(decoded.userId);

    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json(
      formatResponse(
        'error',
        error.message
      )
    )
  }
}
