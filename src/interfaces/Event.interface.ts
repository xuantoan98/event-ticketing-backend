import { Schema } from "mongoose";
import { EventLimitSeat, EventStatus } from "../constants/enum";

export interface IEvent {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  coverImage?: string;
  status: EventStatus;
  ticketsId?: Schema.Types.ObjectId[];

  isLimitSeat?: Number;   // giới hạn chỗ ngồi
  totalSeats?: Number;            // Tổng số chỗ ngồi
  totalCustomerInvites?: Number;  // Tổng số khách mời
  totalSupports?: Number;         // Tổng số nhân viên hỗ trợ
  totalDetails?: Number;          // Tổng số lượng record mô tả sự kiện
  totalCosts?: Number;            // Tổng số lượng record mô tả chi phí 
  totalFeedbacks?: Number;        // Tổng số lượng phản hồi của sự kiện
  estimatePrice: Number;          // Chi phí dự kiến
  realPrice?: Number;             // Chi phí thực tế
  createdAt: Date;
  updateAt: Date;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;

  eventCategoriesId: Schema.Types.ObjectId[];
  supporters: Schema.Types.ObjectId[];
  invites: Schema.Types.ObjectId[];
}
