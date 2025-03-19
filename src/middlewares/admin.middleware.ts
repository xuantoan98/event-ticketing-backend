import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/response.util';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json(
      formatResponse(
        'error',
        'Forbidden: Requires admin privileges'
      )
    )
  }
  next();
};
