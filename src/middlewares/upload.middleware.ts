import multer from "multer";
import { storage } from "../config/cloudinary";

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5  // 5MB
  }
})
