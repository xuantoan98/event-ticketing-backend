import { Types } from "mongoose";
import { Status } from "../constants/enum"

export interface IDepartments {
  _id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}
