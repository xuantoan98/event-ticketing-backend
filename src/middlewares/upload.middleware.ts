import multer from "multer";
import { storage } from "../config/cloudinary";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5  // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.error('[UPLOAD] Invalid file type:', file.mimetype);
      cb(new ApiError(HTTP.INTERNAL_ERROR, 'Invalid file type'));
    }
  }
})

export const handleAvatarUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single('avatar')(req, res, (err: any) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({
        status: 'error',
        messages: [
          err instanceof multer.MulterError 
            ? err.message 
            : 'File upload failed'
        ]
      });
    }
    
    next();
  });
};
