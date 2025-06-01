import { checkSchema } from "express-validator";

export const eventCategoriesValidator = (method: string) => {
  switch (method) {
    case 'create':
      return checkSchema({
        name: {
          notEmpty: true,
          isString: true,
          errorMessage: 'Tên danh mục sự kiện phải là chuỗi',
          isLength: {
            options: {
              min: 2
            },
            errorMessage: 'Tên danh mục phải trên 2 ký tự'
          }
        }
      });

    case 'update':
      return checkSchema({
        name: {
          notEmpty: true,
          isString: true,
          errorMessage: 'Tên danh mục sự kiện phải là chuỗi',
          isLength: {
            options: {
              min: 2
            },
            errorMessage: 'Tên danh mục phải trên 2 ký tự'
          }
        }
      });

    case 'search': 
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
      });

    default:
      return [];
  }
}
