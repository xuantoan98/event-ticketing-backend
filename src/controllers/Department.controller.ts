import { Request, Response } from 'express';
import { DepartmentService } from '../services';
import { formatResponse } from '../utils/response.util';
import Department from '../models/Department.model';
import { AuthMessages, DepartmentMessages } from '../constants/messages';
import { IDepartments } from '../interfaces/Departments.interface';
import { Role } from '../constants/enum';
import { HTTP } from '../constants/https';

const departmentService = new DepartmentService();

/**
 * Function get all departments
 * 
 * @param req 
 * @param res 
 * @returns list departments
 */
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const {
      q,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc'
    } = req.query as {
      q: string
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name' | 'email';
      sortOrder?: 'asc' | 'desc';
    };

    const result = await departmentService.getDepartments(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        DepartmentMessages.GET_ALL_DEPARTMENTS,
        result.departments,
        undefined,
        result.pagination
      )
    );
  } catch (error) {
    res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

/**
 * Function search departments
 * 
 * @param req 
 * @param res 
 * @param query 
 * @returns departments
 */
// export const search = async (req: Request, res: Response) => {
//   try {
//     const { q, page = 1, limit = 10 } = req.query as {
//       q: string;
//       page?: string;
//       limit?: string;
//     };

//     const result = await departmentService.search(q, {
//       page: parseInt(page as string),
//       limit: parseInt(limit as string)
//     });

//     res.status(200).json(
//       formatResponse(
//         'success',
//         DepartmentMessages.SEARCH_DEPARTMENT,
//         result.departments,
//         undefined,
//         result.pagination
//       )
//     ); 
//   } catch (error) {
//     res.status(500).json(
//       formatResponse(
//         'error',
//         `Lỗi hệ thống: ${error}`
//       )
//     )
//   }
// }

/**
 * Function get detail department
 * 
 * @param req 
 * @param res 
 * @param id string
 * @returns information department
 */
export const getDetailDepartment = async(req: Request, res: Response) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id.toString());
    res.status(HTTP.OK).json(formatResponse(
      'success',
      DepartmentMessages.GET_DETAIL_DEPARTMENT,
      department
    ))
  } catch (error) {
    res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    )
  }
}

/**
 * Fucntion create department
 * 
 * @param req 
 * @param res 
 * @returns department
 */
export const createDepartment = async(req: Request, res: Response) => {
  try {
    const dataCreate = {
      ...req.body,
      createdBy: req.user?._id
    } as IDepartments;
    const department = await departmentService.create(dataCreate);
    
    return res.status(HTTP.CREATED).json(
      formatResponse(
        'success',
        DepartmentMessages.CREATE_SUCCESSFULLY,
        department
      )
    )
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    )
  }
}

/**
 * Function update department
 * 
 * @param req 
 * @param res 
 * @returns department
 */
export const updateDepartment = async(req: Request, res: Response) => {
  try {
    const dataUpdate = {
      ...req.body,
      updatedBy: req.user?._id
    } as IDepartments;

    const department = await departmentService.update(
      req.params.id.toString(),
      dataUpdate,
      req.user
    );

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        DepartmentMessages.UPDATE_SUCCESSFULLY,
        department
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    )
  }
}

/**
 * Function delete department
 * 
 * @param req 
 * @param res 
 */
export const deleteDepartment = async(req: Request, res: Response) => {
  try {
    await departmentService.delete(req.params.id.toString(), req.user);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        DepartmentMessages.DELETE_SUCCESSFULLY
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}
