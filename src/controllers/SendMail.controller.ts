import { Request, Response } from "express";
import { HTTP } from "../constants/https";
import { formatResponse } from "../utils/response.util";
import { EmailService } from "../services/EmailService.service";

const emailService = new EmailService();

export const sendMail = async (req: Request, res: Response) => {
  try {
    const response = await emailService.sendMail({...req.body});

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        response.messages
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
