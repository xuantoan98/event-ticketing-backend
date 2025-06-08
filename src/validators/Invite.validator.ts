import { checkSchema } from "express-validator";

export const createInviteValidator = checkSchema({
  name: {
    notEmpty: {
      errorMessage: 'Tên khách mời không được để trống'
    },
    isString: true,
    isLength: {
      options: { min: 2 },
      errorMessage: 'Tên khách mời phải nhiều hơn 2 ký tự'
    }
  },
  email: {
    notEmpty: {
      errorMessage: 'Email khách hàng không được để trống'
    },
    isEmail: {
      errorMessage: 'Emal không hợp lệ'
    }
  },
  phone: {
    notEmpty: {
      errorMessage: 'Số điện thoại không được để trống'
    },
    optional: true,
    matches: {
      options: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      errorMessage: 'Số điện thoại không hợp lệ (10 số)'
    }
  }
});

export const updateInviteValidator = checkSchema({
  name: {
    notEmpty: {
      errorMessage: 'Tên khách mời không được để trống'
    },
    isString: true,
    isLength: {
      options: { min: 2 },
      errorMessage: 'Tên khách mời phải nhiều hơn 2 ký tự'
    },
    optional: true
  },
  email: {
    notEmpty: {
      errorMessage: 'Email khách hàng không được để trống'
    },
    isEmail: {
      errorMessage: 'Emal không hợp lệ'
    },
    optional: true
  },
  phone: {
    notEmpty: {
      errorMessage: 'Số điện thoại không được để trống'
    },
    optional: true,
    matches: {
      options: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      errorMessage: 'Số điện thoại không hợp lệ (10 số)'
    }
  }
});

export const searchInviteValidator = checkSchema({
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
