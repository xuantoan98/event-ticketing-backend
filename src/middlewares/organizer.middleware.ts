import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/response.util';

export const requireOrganizer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'organizer') {
    return res.status(403).json(
      formatResponse(
        'error',
        'Forbidden: Requires organizer privileges'
      )
    )
  }
  next();
};
