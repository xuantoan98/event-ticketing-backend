import { checkSchema } from 'express-validator'

export const validate = (method: string) => {
  switch (method) {
    case 'register': {
      return checkSchema({
        name: {
          isString: true,
          errorMessage: 'Tên phải là chuỗi',
          isLength: {
            options: { min: 2 },
            errorMessage: 'Tên phải có ít nhất 2 ký tự'
          }
        },
        email: {
          isEmail: true,
          errorMessage: 'Email không hợp lệ'
        },
        password: {
          isLength: {
            options: { min: 6 },
            errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự'
          }
        }
      });
    }

    default:
      return [];
  }
};