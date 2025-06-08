import { Schema } from "mongoose";

export interface IInvites {
  _id: string;
  name: string;
  email: string;
  phone: string;
  fax: string;
  organization: string;
  createdAt: Date;
  updatedAt: Date;
  status: Number;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}
