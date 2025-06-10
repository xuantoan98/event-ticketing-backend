import { checkSchema } from "express-validator";
import { EventSupportAcceptStatus, Status } from "../constants/enum";

export const createEventSupportValidator = checkSchema({
  eventId: {
    notEmpty: {
      errorMessage: 'Mã sự kiện không được để trống'
    }
  },
  userId: {
    notEmpty: true,
    isArray: true,
    errorMessage: 'Danh sách người hỗ trợ phải là một mảng',
    isLength: {
      options: { min: 1 },
      errorMessage: 'Sự kiện phải có tối thiếu 01 người hỗ trợ'
    }
  },
  responsible: {
    isString: true,
    optional: true
  },
  isAccept: {
    optional: true,
    isIn: {
      options: [Object.values(EventSupportAcceptStatus)],
      errorMessage: `isAccept phải là: ${Object.values(EventSupportAcceptStatus).join(', ')}`
    }
  },
  description: {
    optional: true,
    isString: true
  },
  note: {
    optional: true,
    isString: true
  },
  status: {
    optional: true,
    isIn: {
      options: [Object.values(Status)],
      errorMessage: `Trạng thái người hỗ trợ phải là một trong: ${Object.values(Status).join(', ')}`
    }
  }
});

export const updateEventSupportValidator = checkSchema({
  eventId: {
    optional: true,
    notEmpty: {
      errorMessage: 'Mã sự kiện không được để trống'
    }
  },
  userId: {
    optional: true,
    notEmpty: true,
    isArray: true,
    errorMessage: 'Danh sách người hỗ trợ phải là một mảng',
    isLength: {
      options: { min: 1 },
      errorMessage: 'Sự kiện phải có tối thiếu 01 người hỗ trợ'
    }
  },
  responsible: {
    isString: true,
    optional: true
  },
  isAccept: {
    optional: true,
    isIn: {
      options: [Object.values(EventSupportAcceptStatus)],
      errorMessage: `isAccept phải là: ${Object.values(EventSupportAcceptStatus).join(', ')}`
    }
  },
  description: {
    optional: true,
    isString: true
  },
  note: {
    optional: true,
    isString: true
  },
  status: {
    optional: true,
    isIn: {
      options: [Object.values(Status)],
      errorMessage: `Trạng thái người hỗ trợ phải là một trong: ${Object.values(Status).join(', ')}`
    }
  }
});

export const searchEventSupportValidator = checkSchema({
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
