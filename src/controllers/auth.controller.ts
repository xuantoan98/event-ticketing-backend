import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";
import { formatResponse } from "../utils/response.util";
import { IUserDocument } from "../interfaces/User.interface";

const authService = new AuthService();

export class AuthController {
  async login(
    req: Request,
    res: Response
  ) {
    try {
      const { email, password } = req.body;
      const user = await authService.authenticate(email, password) as IUserDocument
      const { accessToken, refreshToken } = await authService.generateTokens(user._id.toString());
      await authService.saveRefreshToken(user._id.toString(), refreshToken);

      return res.status(200).json(
        formatResponse(
          'success',
          'Đăng nhập thành công',
          {
            user: user,
            tokens: {
              accessToken,
              refreshToken
            }
          }
        )
      );

    } catch (error: any) {
      return res.status(500).json(
        formatResponse(
          'error',
          error.message
        )
      )
    }
  }

  async refreshToken(
    req: Request,
    res: Response
  ) {
    try {
      const { refreshToken } = req.body;
      const user = await authService.validateRefreshToken(refreshToken);
      // Xóa token cũ và tạo token mới
      await authService.removeRefreshToken(user._id.toString(), refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = await authService.generateTokens(user._id.toString());

      await authService.saveRefreshToken(user._id.toString(), newRefreshToken);
      return res.status(200).json(
        formatResponse(
          'success',
          'Token refreshed successfully',
          {
            user: user,
            tokens: {
              accessToken,
              refreshToken: newRefreshToken
            }
          }
        )
      )
    } catch (error: any) {
      return res.status(500).json(
        formatResponse(
          'error',
          error.message
        )
      )
    }
  }
}