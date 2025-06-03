import { Types } from "mongoose";
import { IDepartments } from "../interfaces/Departments.interface";
import DepartmentModel from "../models/Department.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";

export class DepartmentService {
  async create(departmentData: IDepartments) {
    const departmentExit = await DepartmentModel.findOne({
      name: departmentData.name,
      email: departmentData.email
    });

    if(departmentExit) {
      throw new Error('Phòng ban đã tồn tại');
    }

    const department = DepartmentModel.create(departmentData);
    return department;
  }

  async update(departmentId: string, departmentUpdate: IDepartments) {
    if(!Types.ObjectId.isValid(departmentId)) {
      throw new Error('ID phòng ban không đúng');
    }

    const department = DepartmentModel.findByIdAndUpdate(
      departmentId,
      departmentUpdate,
      { new: true, runValidators: true }
    ).exec();

    if(!department) {
      throw new Error('Phòng ban không tồn tại trong hệ thống');
    }
    return department;
  }

  async delete(departmentId: string) {
    if(!Types.ObjectId.isValid(departmentId)) {
      throw new Error('ID phòng ban không đúng');
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await DepartmentModel.findOneAndUpdate({
      _id: departmentId,
      status: 0
    });

    return result;
  }

  async getDepartmentById(departmentId: string) {
    if(!Types.ObjectId.isValid(departmentId)) {
      throw new Error('ID phòng ban không đúng');
    }

    return DepartmentModel.findById(departmentId);
  }

  async getDepartments(options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IDepartments;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [departments, total] = await Promise.all([
      DepartmentModel.find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      DepartmentModel.countDocuments()
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

  async search(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IDepartments;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };
    const searchRegex = new RegExp(query, 'i');

    const [departments, total] = await Promise.all([
      DepartmentModel.find({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      DepartmentModel.countDocuments({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]
      })
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