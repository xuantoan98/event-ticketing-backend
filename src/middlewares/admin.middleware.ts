import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/response.util';
import { Role } from '../constants/enum';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== Role.ADMIN) {
    return res.status(403).json(
      formatResponse(
        'error',
        'Forbidden: Permission denied'
      )
    )
  }
  next();
};
