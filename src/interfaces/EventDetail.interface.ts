import { Schema } from "mongoose";

export interface IEventDetail {
  _id: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  name: String;
  description: String;
  startAt: Number;
  endAt: Number;
  status: Number;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}
