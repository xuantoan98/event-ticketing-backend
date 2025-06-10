import { model, Schema } from "mongoose";
import { IEventDetail } from "../interfaces/EventDetail.interface";
import { Status } from "../constants/enum";

const eventDetailSchema = new Schema<IEventDetail>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: { type: String },
  startAt: {
    type: Number,
    required: true
  },
  endAt: { type: Number },
  status: {
    type: Number,
    enum: Status,
    default: Status.ACTIVE
  }
});

const EventDetail = model<IEventDetail>('EventDetail', eventDetailSchema);
export default EventDetail;
