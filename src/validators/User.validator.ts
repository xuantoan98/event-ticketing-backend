import { checkSchema } from 'express-validator'
import { Gender } from '../constants/enum';

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

    case 'login': {
      return checkSchema({
        email: { 
          isEmail: true, 
          errorMessage: 'Email không hợp lệ',
          notEmpty: true
        },
        password: {
          exists: true,
          notEmpty: true
        }
      });
    }

    case 'update': {
      return checkSchema({
        name: {
          optional: true,
          isString: true
        },
        password: {
          optional: true,
          isLength: {
            options: {
              min: 6
            },
            errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự'
          }
        },
        dateOfBirth: {
          optional: true,
          isDate: {
            errorMessage: 'Ngày sinh không hợp lệ (YYYY-MM-DD)'
          }
        },
        gender: {
          optional: true,
          isIn: {
            options: [Object.values(Gender)],
            errorMessage: `Giới tính phải là một trong: ${Object.values(Gender).join(', ')}`
          }
        },
        phone: {
          optional: true,
          matches: {
            options: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
            errorMessage: 'Số điện thoại không hợp lệ (10 số)'
          }
        }
      });
    }

    case 'list': {
      return checkSchema({
        page: {
          optional: true,
          isInt: { 
            options: { min: 1 },
            errorMessage: 'Page phải là số nguyên ≥ 1' 
          }
        },
        limit: {
          optional: true,
          isInt: { 
            options: { min: 1, max: 100 },
            errorMessage: 'Limit phải từ 1 đến 100' 
          }
        },
        sortBy: {
          optional: true,
          isIn: {
            options: [['createdAt', 'name', 'email']],
            errorMessage: 'Chỉ được sắp xếp theo: createdAt, name, email'
          }
        },
        sortOrder: {
          optional: true,
          isIn: {
            options: [['asc', 'desc']],
            errorMessage: 'Thứ tự sắp xếp không hợp lệ'
          }
        }
      })
    }

    case 'search': {
      return checkSchema({
        q: {
          isString: true,
          notEmpty: {
            errorMessage: 'Từ khóa không được để trống'
          }
        },
        page: {
          optional: true,
          isInt: {
            options: { min: 1 },
            errorMessage: 'Page phải là số nguyên dương'
          }
        },
        limit: {
          optional: true,
          isInt: { 
            options: { min: 1, max: 100 },
            errorMessage: 'Limit phải từ 1 đến 100' 
          }
        }
      })
    }

    case 'changePassword': {
      return checkSchema({
        oldPassword: {
          notEmpty: { errorMessage: 'Vui lòng nhập mật khẩu cũ' },
          isLength: {
            options: { min: 6 },
            errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự'
          }
        },
        newPassword: {
          notEmpty: { errorMessage: 'Vui lòng nhập mật khẩu mới' },
          isLength: {
            options: { min: 6 },
            errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự'
          },
          custom: {
            options: (value, { req }) => value !== req.body.oldPassword,
            errorMessage: 'Mật khẩu mới không được trùng mật khẩu cũ'
          }
        }
      })
    }

    default:
      return [];
  }
};