import { Types } from "mongoose";
import { IDepartments } from "../interfaces/Departments.interface";
import DepartmentModel from "../models/Department.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { IUserDocument } from "../interfaces/User.interface";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages } from "../constants/messages";
import { Role } from "../constants/enum";

export class DepartmentService {
  /**
   * 
   * @param departmentData 
   * @returns 
   */
  async create(departmentData: IDepartments) {
    const departmentExit = await DepartmentModel.findOne({
      name: departmentData.name,
      email: departmentData.email
    });

    if(departmentExit) {
      throw new ApiError(HTTP.CONFLICT, 'Phòng ban đã tồn tại');
    }

    const department = await DepartmentModel.create(departmentData);
    return department;
  }

  /**
   * 
   * @param departmentId 
   * @param departmentUpdate 
   * @param currentUser 
   * @returns 
   */
  async update(departmentId: string, departmentUpdate: IDepartments, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(!Types.ObjectId.isValid(departmentId)) {
      throw new ApiError(HTTP.INTERNAL_ERROR, 'ID phòng ban không đúng');
    }

    const departmentExits = await DepartmentModel.findById(departmentId.toString());
    if (!departmentExits) {
      throw new ApiError(HTTP.NOT_FOUND, 'Phòng ban không tồn tại');
    }

    const department = await DepartmentModel.findByIdAndUpdate(
      departmentId,
      departmentUpdate,
      { new: true, runValidators: true }
    ).exec();

    if(!department) {
      throw new ApiError(HTTP.NOT_FOUND, 'Phòng ban không tồn tại trong hệ thống');
    }
    return department;
  }

  /**
   * 
   * @param departmentId 
   * @param currentUser 
   * @returns 
   */
  async delete(departmentId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (currentUser?.role !== Role.ADMIN) {
      throw new ApiError(HTTP.FORBIDDEN, AuthMessages.FORBIDDEN);
    }

    const departmentExits = await DepartmentModel.findById(departmentId.toString());
    if (!departmentExits) {
      throw new ApiError(HTTP.NOT_FOUND, 'Phòng ban không tồn tại');
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await DepartmentModel.findOneAndUpdate({
      _id: departmentId,
      status: 0
    });

    return result;
  }

  /**
   * 
   * @param departmentId 
   * @returns 
   */
  async getDepartmentById(departmentId: string) {
    if(!Types.ObjectId.isValid(departmentId)) {
      throw new Error('ID phòng ban không đúng');
    }

    return await DepartmentModel.findById(departmentId);
  }

  /**
   * 
   * @param query 
   * @param options 
   * @returns 
   */
  async getDepartments(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IDepartments;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    let filter = {};
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter = {
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]
      }
    }

    const [departments, total] = await Promise.all([
      DepartmentModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      DepartmentModel.countDocuments(filter)
    ])

    return {
      departments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}
