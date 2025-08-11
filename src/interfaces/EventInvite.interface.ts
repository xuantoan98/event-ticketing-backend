import { Schema } from "mongoose";

export interface IEventInvite {
  _id: string;
  inviteId: Schema.Types.ObjectId[];
  eventId: Schema.Types.ObjectId;
  note: string;
  updatedAt: Date;
  status: Number;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
};
