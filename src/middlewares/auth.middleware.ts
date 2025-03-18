import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDocument } from '../interfaces/User.interface';
import { UserService } from '../services/User.service';

const userService = new UserService();

declare module 'express' {
  interface Request {
    user?: IUserDocument
  }
}

export const authMiddleware = (roles?: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if(!token) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      userId: string;
      role: string;
    };

    const user = await userService.getUserById(decoded.userId);
    if(!user || (roles && !roles.includes(user.role))) {
      return res.status(403).json({
        error: 'Forbidden'
      })
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
};

