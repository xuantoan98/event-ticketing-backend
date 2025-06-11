import { checkSchema } from "express-validator";

export const createFeedbackValidator = checkSchema({
  title: {
    notEmpty: {
      errorMessage: 'Tiêu đề phản hồi không được để trống'
    },
    isString: true,
    isLength: {
      options: {
        min: 5,
        max: 255
      }
    }
  },
  name: {
    notEmpty: {
      errorMessage: 'Tên người phản hồi không được để trống'
    },
    isString: true
  },
  phone: {
    optional: true,
    matches: {
      options: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      errorMessage: 'Số điện thoại không hợp lệ (10 số)'
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
  point: {
    optional: true,
    isInt: true
  },
  content: {
    optional: true,
    isString: true
  },
  eventId: {
    notEmpty: {
      errorMessage: 'Mã sự kiện không được để trống'
    }
  }
});

export const updateFeedbackValidator = checkSchema({
  title: {
    optional: true,
    notEmpty: {
      errorMessage: 'Tiêu đề phản hồi không được để trống'
    },
    isString: true,
    isLength: {
      options: {
        min: 5,
        max: 255
      }
    }
  },
  name: {
    optional: true,
    notEmpty: {
      errorMessage: 'Tên người phản hồi không được để trống'
    },
    isString: true
  },
  phone: {
    optional: true,
    matches: {
      options: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      errorMessage: 'Số điện thoại không hợp lệ (10 số)'
    }
  },
  email: {
    optional: true,
    notEmpty: {
      errorMessage: 'Email khách hàng không được để trống'
    },
    isEmail: {
      errorMessage: 'Emal không hợp lệ'
    }
  },
  point: {
    optional: true,
    isInt: true
  },
  content: {
    optional: true,
    isString: true
  },
  eventId: {
    optional: true,
    notEmpty: {
      errorMessage: 'Mã sự kiện không được để trống'
    }
  }
});