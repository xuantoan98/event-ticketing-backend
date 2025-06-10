import { Schema } from "mongoose";

export interface IEventSupport {
  _id: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId[];
  responsible: String;              // Nội dung hỗ trợ
  isAccept: Number;
  description: String;              // Mô tả về công việc được giao
  note: String;                     // Ghi chú về công việc
  updatedAt: Date;
  status: Number;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}
