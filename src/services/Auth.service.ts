import User from "../models/User.model";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { IUserDocument } from "../interfaces/User.interface";
import { AuthMessages, UserMessages } from "../constants/messages";
import bcrypt from "bcrypt";
import { EmailOptions } from "../interfaces/common/EmailOptions.interface";
import { EmailService } from "./EmailService.service";

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

  async forgotPassword(email: string) {
    const user = await User.findOne({email: email});
    if (!user) {
      throw new ApiError(HTTP.NOT_FOUND, UserMessages.USER_NOT_FOUND);
    }

    const saltRounds = parseInt(process.env.SALT || '10', 10);
    const salt = await bcrypt.genSalt(saltRounds);

    const userUpdate = await User.findByIdAndUpdate(user._id, {
      password: await bcrypt.hash('masterx@1234', salt),
      passwordChangedAt: new Date()
    }).select('-password') as IUserDocument;


    // Thay đổi mật khẩu xong, gửi 1 email tới email trên
    // Khởi tạo giá trị
    const emailOptionRegister: EmailOptions = {
      to: user.email,
      subject: 'Thay đổi mật khẩu thành công',
      text: 'Mật khẩu đăng nhập của bạn đã được thay đổi. Vui lòng đăng nhập với mật khẩu mới: masterx@1234'
    };

    // Thực hiện gửi mail
    try {
      const emailService = new EmailService();
      await emailService.sendMail(emailOptionRegister);
    } catch (error) {
      throw new ApiError(HTTP.BAD_REQUEST, 'Có lỗi khi gửi mail');
    }

    return userUpdate;

  }
}
