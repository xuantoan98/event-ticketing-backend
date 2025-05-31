import { Schema, model } from "mongoose";
import { IDepartments } from "../interfaces/Departments.interface";
import { Status } from "../constants/enum";

const departmentSchema = new Schema<IDepartments> (
  {
    name: { type: String, required: true },
    email: {
      type: String, 
			required: true, 
			unique: true,
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    phone: String,
    description: String,
    status: {
      type: Number,
      enum: Status,
      default: Status.ACTIVE
    }
  },
  {
    timestamps: true
  }
);

const Department = model<IDepartments>("Department", departmentSchema);
export default Department;