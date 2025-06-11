import { Types } from "mongoose";

export interface IFeedback {
  _id: Types.ObjectId;
  title: string;
  name: string;
  phone: string;
  email: string;
  point: Number;
  content: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  eventId: Types.ObjectId;
}
