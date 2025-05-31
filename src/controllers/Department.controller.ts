import { Request, Response } from 'express';
import { DepartmentService } from '../services';
import { formatResponse } from '../utils/response.util';
import Department from '../models/Department.model';

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
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc'
    } = req.query as {
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name' | 'email';
      sortOrder?: 'asc' | 'desc';
    };

    const result = await departmentService.getDepartments({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        'Lấy danh sách phòng ban thành công',
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
export const search = async (req: Request, res: Response) => {
  try {
    const { q, page = 1, limit = 10 } = req.query as {
      q: string;
      page?: string;
      limit?: string;
    };

    const result = await departmentService.search(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.status(200).json(
      formatResponse(
        'success',
        'Tìm kiếm phòng ban thành công',
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
    )
  }
}

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
    if (!req.user) {
      res.status(401).json(
        formatResponse(
          'error',
          'Unauthorized'
        )
      )
    }

    const department = await departmentService.getDepartmentById(req.params.id.toString());
    res.status(200).json(formatResponse(
      'success',
      'Lấy thông tin phòng ban thành công',
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
      res.status(500).json(
        formatResponse(
          'error',
          'Phòng ban đã tồn tại trong hệ thống'
        )
      )
    }

    const department = await departmentService.create(req.body);
    
    res.status(201).json(
      formatResponse(
        'success',
        'Tạo mới phòng ban thành công',
        department
      )
    )
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
 * Function update department
 * 
 * @param req 
 * @param res 
 * @returns department
 */
export const updateDepartment = async(req: Request, res: Response) => {
  try {
    const departmentExit = await Department.findById(req.params.id.toString());
    if(!departmentExit) {
      res.status(500).json(
        formatResponse(
          'error',
          'Phòng ban không tồn tại trong hệ thống'
        )
      );
    };

    const department = await departmentService.update(
      req.params.id.toString(),
      req.body
    );

    res.status(200).json(
      formatResponse(
        'success',
        'Cập nhật thông tin phòng ban thành công',
        department
      )
    );
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
 * Function delete department
 * 
 * @param req 
 * @param res 
 */
export const deleteDepartment = async(req: Request, res: Response) => {
  try {
    const departmentExit = await Department.findById(req.params.id.toString());
    if(!departmentExit) {
      res.status(500).json(
        formatResponse(
          'error',
          'Phòng ban không tồn tại trong hệ thống'
        )
      );
    };

    const department = await departmentService.delete(req.params.id.toString());
    res.status(200).json(
      formatResponse(
        'success',
        'Xóa phòng ban thành công'
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
