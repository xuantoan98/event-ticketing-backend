import User from "../models/User.model";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";

require('dotenv').config();

export class AuthService {
  /**
   * Generate JWT tokens
   * @param userId 
   * @returns 
   */
  async generateTokens (userId: string) {
    return {
      accessToken: jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '10d' }
      ),
      refreshToken: jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      )
    };
  }

  /**
   * authenticate
   * @param email 
   * @param password 
   * @returns 
   */
  async authenticate (
    email: string,
    password: string
  ) {
    const user = await User.findOne({ email }).select('+password +refreshTokens');
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(HTTP.INTERNAL_ERROR, 'Email hoặc mật khẩu không đúng');
    }
    return user;
  }

  /**
   * Save refresh token to user
   * @param userId 
   * @param refreshToken 
   */
  async saveRefreshToken (
    userId: string,
    refreshToken: string
  ) {
    await User.findByIdAndUpdate(
      userId,
      { $push: { refreshTokens: refreshToken } },
      { new: true }
    );
  }

  /**
   * Remove refresh token from user
   * @param userId 
   * @param refreshToken 
   */
  async removeRefreshToken (
    userId: string,
    refreshToken: string
  ) {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { refreshTokens: refreshToken } }
    );
  }

  /**
   * valiedate refresh token
   * @param refreshToken 
   * @returns 
   */
  async validateRefreshToken (refreshToken: string) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('+refreshTokens');
    
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new ApiError(HTTP.INTERNAL_ERROR, 'Invalid refresh token');
    }
    return user;
  }
}
