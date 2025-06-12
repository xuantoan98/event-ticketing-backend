import { Request, Response } from 'express';
import { DepartmentService } from '../services';
import { formatResponse } from '../utils/response.util';
import Department from '../models/Department.model';
import { AuthMessages, DepartmentMessages } from '../constants/messages';
import { IDepartments } from '../interfaces/Departments.interface';
import { Role } from '../constants/enum';

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

    return res.status(200).json(
      formatResponse(
        'success',
        DepartmentMessages.GET_ALL_DEPARTMENTS,
        result.departments,
        undefined,
        result.pagination
      )
    );
  } catch (error) {
    res.status(500).json(
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
    res.status(200).json(formatResponse(
      'success',
      DepartmentMessages.GET_DETAIL_DEPARTMENT,
      department
    ))
  } catch (error) {
    res.status(500).json(
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
    const departmentExit = await Department.findOne({
      name: req.body.name,
      email: req.body.email
    });
    
    if(departmentExit) {
      return res.status(400).json(
        formatResponse(
          'error',
          DepartmentMessages.DEPARTMENT_EXITS
        )
      )
    }

    const dataCreate = {
      ...req.body,
      createdBy: req.user?._id
    } as IDepartments;
    const department = await departmentService.create(dataCreate);
    
    return res.status(201).json(
      formatResponse(
        'success',
        DepartmentMessages.CREATE_SUCCESSFULLY,
        department
      )
    )
  } catch (error) {
    return res.status(500).json(
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
    const currentUser = req.user;
    const departmentExit = await departmentService.getDepartmentById(req.params.id.toString());
    if(!departmentExit) {
      return res.status(400).json(
        formatResponse(
          'error',
          DepartmentMessages.NOT_FOUND
        )
      );
    };

    if (currentUser?.role !== Role.ADMIN && departmentExit.createdBy.toString() !== currentUser?._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    const dataUpdate = {
      ...req.body,
      updatedBy: req.user?._id
    } as IDepartments;
    const department = await departmentService.update(
      req.params.id.toString(),
      dataUpdate
    );

    return res.status(200).json(
      formatResponse(
        'success',
        DepartmentMessages.UPDATE_SUCCESSFULLY,
        department
      )
    );
  } catch (error) {
    return res.status(500).json(
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
    const currentUser = req.user;
    const department = await departmentService.getDepartmentById(req.params.id.toString());
    if(!department) {
      return res.status(400).json(
        formatResponse(
          'error',
          DepartmentMessages.NOT_FOUND
        )
      );
    };

    if (currentUser?.role !== Role.ADMIN && department.createdBy.toString() !== currentUser?._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    const result = await departmentService.delete(req.params.id.toString());
    return res.status(200).json(
      formatResponse(
        'success',
        DepartmentMessages.DELETE_SUCCESSFULLY
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}
