import { model, Schema } from "mongoose";
import { IEventInvite } from "../interfaces/EventInvite.interface";
import { Status } from "../constants/enum";

const eventInviteSchema = new Schema<IEventInvite>({
  inviteId: [{
    type: Schema.Types.ObjectId,
    ref: 'Invite',
    require: true
  }],
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  note: {
    type: String
  },
  status: {
    type: Number,
    enum: Status,
    default: Status.ACTIVE
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
}, { timestamps: true });

const EventInvite = model<IEventInvite>('EventInvite', eventInviteSchema);
export default EventInvite;
