import { checkSchema } from "express-validator";
import { EventCostType } from "../constants/enum";

export const createEventCostValidator = checkSchema({
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'Tên chi phí không được để trống'
    },
    isString: true,
    isLength: {
      options: {
        min: 7,
        max: 255
      },
      errorMessage: 'Tên chi phí không ít hơn 7 ký tự'
    }
  },
  price: {
    notEmpty: {
      errorMessage: 'Chi phí không được để trống'
    }
  },
  type: {
    isIn: {
      options: [Object.values(EventCostType)],
      errorMessage: `Loại chi phí phải là một trong: ${Object.values(EventCostType).join(', ')}`
    }
  },
  note: {
    isString: true,
    optional: true
  },
  quantity: {
    optional: true
  },
  eventId: {
    notEmpty: {
      errorMessage: 'Mã sự kiện không được để trống'
    }
  }
});

export const updateEventCostValidator = checkSchema({
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'Tên chi phí không được để trống'
    },
    isString: true,
    isLength: {
      options: {
        min: 7,
        max: 255
      },
      errorMessage: 'Tên chi phí không ít hơn 7 ký tự'
    },
    optional: true
  },
  price: {
    notEmpty: {
      errorMessage: 'Chi phí không được để trống'
    },
    optional: true
  },
  type: {
    isIn: {
      options: [Object.values(EventCostType)],
      errorMessage: `Loại chi phí phải là một trong: ${Object.values(EventCostType).join(', ')}`
    },
    optional: true
  },
  note: {
    isString: true,
    optional: true
  },
  quantity: {
    optional: true
  },
  eventId: {
    notEmpty: {
      errorMessage: 'Mã sự kiện không được để trống'
    }
  }
});
