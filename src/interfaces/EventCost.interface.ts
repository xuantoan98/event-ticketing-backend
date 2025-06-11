import { Schema } from "mongoose";

export interface IEventCost {
  _id: Schema.Types.ObjectId;
  name: String;
  price: Number;
  type: Number;
  note: String;
  quantity: Number;
  eventId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}
