import { model, Schema } from "mongoose";
import { IEventSupport } from "../interfaces/EventSupport.interface";
import { EventSupportAcceptStatus, Status } from "../constants/enum";

const eventSupportSchema = new Schema<IEventSupport>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }],
  responsible: { type: String },
  isAccept: {
    type: Number,
    enum: Object.values(EventSupportAcceptStatus),
    default: EventSupportAcceptStatus.ACCEPT
  },
  description: { type: String },
  note: { type: String },
  status: {
    type: Number,
    enum: Object.values(Status),
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
});

const EventSupport = model<IEventSupport>('EventSupport', eventSupportSchema);
export default EventSupport;
