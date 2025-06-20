import multer from "multer";
import { storage } from "../config/cloudinary";
import { Request } from "express";

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5  // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.error('[UPLOAD] Invalid file type:', file.mimetype);
      cb(new Error('Invalid file type'));
    }
  }
});

export const uploadSingleImage = (fieldName: string, req: Request) => {
  return new Promise((resolve, reject) => {
    const uploader = upload.single(fieldName);

    uploader(req, {} as any, (err: any) => {
      if (err) {
        reject(err);
      } else if (!req.file) {
        reject(new Error('No file uploaded.'));
      } else {
        resolve(req.file);
      }
    });
  });
};
