import nodemailer from 'nodemailer';
import { EmailOptions } from '../interfaces/common/EmailOptions.interface';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { ApiError } from '../utils/ApiError';
import { HTTP } from '../constants/https';
import { CommonMessages } from '../constants/messages';

export class EmailService {
  async sendMail(options: EmailOptions) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      let htmlContent = options.html;

      // nếu sử dụng template
      if (options.template && options.context) {
        const templatePath = path.join(__dirname, '../templates/emails', `${options.template}.hbs`);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const compliedTemplate = handlebars.compile(templateSource);
        htmlContent = compliedTemplate(options.context);
      }

      const mailOptions = {
        from: `"MasterX" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text || '', // Nội dung dạng text (nếu có)
        html: htmlContent || '', // Nội dung dạng HTML
      }

      const result = await transporter.sendMail(mailOptions);
      if (result.rejected.length > 0) {
        throw new ApiError(HTTP.INTERNAL_ERROR, CommonMessages.SENTMAIL_FAILED);
      }
      
      return {
        status: HTTP.OK,
        messages: CommonMessages.SENTMAIL_SUCCESSFULLY
      }
    } catch (error) {
      throw new ApiError(HTTP.INTERNAL_ERROR, `${CommonMessages.SENTMAIL_FAILED}: ${error}`);
    }
  }
}
