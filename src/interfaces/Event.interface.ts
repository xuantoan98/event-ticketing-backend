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

  isLimitSeat?: EventLimitSeat;   // giới hạn chỗ ngồi
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

  eventCategoriesId: Schema.Types.ObjectId[];
}
