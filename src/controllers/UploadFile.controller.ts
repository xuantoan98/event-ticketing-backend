import { Request, Response } from "express";
import { HTTP } from "../constants/https";
import { formatResponse } from "../utils/response.util";
import { uploadSingleImage } from "../services/upload.service";
import { ApiError } from "../utils/ApiError";
import { UserMessages } from "../constants/messages";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = await uploadSingleImage('avatar', req) as any;
    if(!file || !file.path) {
      throw new ApiError(HTTP.INTERNAL_ERROR, UserMessages.USER_CHOOSE_AVT);
    }
    
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        'Thành công',
        file
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `${error}`
      )
    );
  }
}
