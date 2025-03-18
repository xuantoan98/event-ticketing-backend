import { Request, Response, NextFunction } from 'express';

export const checkOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestedUserId = req.params.id;
  
  if (requestedUserId !== req.user?.id.toString()) {
    return res.status(403).json({ 
      error: 'Quyền bị hạn chế' 
    });
  }
  
  next();
};  