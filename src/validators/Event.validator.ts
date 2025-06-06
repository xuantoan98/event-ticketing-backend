import { checkSchema } from "express-validator";
import { EventStatus } from "../constants/enum";

export const eventCreateValidator = checkSchema({
  title: {
    notEmpty: {
      errorMessage: 'Tiêu đề sự kiện không được để trống',
    },
    trim: true,
    isLength: {
      options: { min: 5, max: 255 },
      errorMessage: 'Tiêu đề cần nhiều hơn 5 ký tự và nhỏ hơn 255 ký tự'
    }
  },
  description: {
    notEmpty: {
      errorMessage: 'Mô tả sự kiện không được để trống',
    },
    isString: true,
    isLength: {
      options: { min: 10 },
      errorMessage: 'Mô tả sự kiện cần nhiều hơn 10 ký tự'
    }
  },
  startDate: {
    isISO8601: {
      errorMessage: 'Thời gian bắt đầu phải đúng với định dạng ISO 8601'
    },
    notEmpty: {
      errorMessage: 'Thời gian bắt đầu không được để trống'
    }
  },
  endDate: {
    isISO8601: {
      errorMessage: 'Thời gian kết thúc phải đúng với định dạng ISO 8601'
    },
    notEmpty: {
      errorMessage: 'Thời gian kết thúc không được để trống'
    }
  },
  location: {
    isString: true,
    notEmpty: {
      errorMessage: 'Địa điểm không được để trống'
    }
  },
  status: {
    optional: true,
    isIn: {
      options: [Object.values(EventStatus)],
      errorMessage: `Trạng thái sự kiện phải là một trong: ${Object.values(EventStatus).join(', ')}`
    }
  },
  eventCategoriesId: {
    notEmpty: true,
    isArray: true,
    errorMessage: 'Danh sách danh mục phải là một mảng',
    isLength: {
      options: { min: 1 },
      errorMessage: 'Sự kiện cần thuộc ít nhất 01 danh mục'
    }
  }
});

export const updateEventValidator = checkSchema({
  title: {
    optional: true,
    notEmpty: {
      errorMessage: 'Tiêu đề sự kiện không được để trống',
    },
    trim: true,
    isLength: {
      options: { min: 5, max: 255 },
      errorMessage: 'Tiêu đề cần nhiều hơn 5 ký tự và nhỏ hơn 255 ký tự'
    }
  },
  description: {
    optional: true,
    notEmpty: {
      errorMessage: 'Mô tả sự kiện không được để trống',
    },
    isString: true,
    isLength: {
      options: { min: 10 },
      errorMessage: 'Mô tả sự kiện cần nhiều hơn 10 ký tự'
    }
  },
  startDate: {
    optional: true,
    isISO8601: {
      errorMessage: 'Thời gian bắt đầu phải đúng với định dạng ISO 8601'
    },
    notEmpty: {
      errorMessage: 'Thời gian bắt đầu không được để trống'
    }
  },
  endDate: {
    optional: true,
    isISO8601: {
      errorMessage: 'Thời gian kết thúc phải đúng với định dạng ISO 8601'
    },
    notEmpty: {
      errorMessage: 'Thời gian kết thúc không được để trống'
    }
  },
  location: {
    optional: true,
    isString: true,
    notEmpty: {
      errorMessage: 'Địa điểm không được để trống'
    }
  },
  status: {
    optional: true,
    isIn: {
      options: [Object.values(EventStatus)],
      errorMessage: `Trạng thái sự kiện phải là một trong: ${Object.values(EventStatus).join(', ')}`
    }
  },
  eventCategoriesId: {
    optional: true,
    notEmpty: true,
    isArray: true,
    errorMessage: 'Danh sách danh mục phải là một mảng',
    isLength: {
      options: { min: 1 },
      errorMessage: 'Sự kiện cần thuộc ít nhất 01 danh mục'
    }
  }
});

export const searchEventValidator = checkSchema({
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

export const eventByCategoriesValidator = checkSchema({
  categoryIds: {
    notEmpty: true,
    errorMessage: 'Danh sách mã danh mục không được để trống'
  }
});
