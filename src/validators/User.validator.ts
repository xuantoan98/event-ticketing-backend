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

    case 'login': {
      return checkSchema({
        email: { isEmail: true },
        password: { exists: true }
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

    default:
      return [];
  }
};