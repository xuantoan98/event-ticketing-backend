import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/response.util";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json(
    formatResponse(
      'error',
      process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    )
  )
}