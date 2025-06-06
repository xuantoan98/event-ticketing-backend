import { checkSchema } from "express-validator";

export const createDepartmentValidator = checkSchema({
  name: {
    notEmpty: true,
    isString: true,
    errorMessage: 'Tên phòng ban phải là chuỗi',
    isLength: {
      options: { min: 2 },
      errorMessage: 'Tên phải nhiều hơn 2 ký tự'
    }
  },
  email: {
    notEmpty: true,
    isEmail: true,
    errorMessage: 'Email không hợp lệ'
  },
  phone: {
    notEmpty: true,
    optional: true,
    matches: {
      options: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      errorMessage: 'Số điện thoại không hợp lệ (10 số)'
    }
  }
});

export const updateDepartmentValidator = checkSchema({
  name: {
    optional: true,
    notEmpty: true,
    isString: true,
    errorMessage: 'Tên phòng ban phải là chuỗi',
    isLength: {
      options: { min: 2 },
      errorMessage: 'Tên phải nhiều hơn 2 ký tự'
    }
  },
  email: {
    optional: true,
    notEmpty: true,
    isEmail: true,
    errorMessage: 'Email không hợp lệ'
  },
  phone: {
    notEmpty: true,
    optional: true,
    matches: {
      options: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      errorMessage: 'Số điện thoại không hợp lệ (10 số)'
    }
  }
});

export const searchDepartmentValidator = checkSchema({
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
});
