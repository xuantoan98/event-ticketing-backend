import { model, Schema } from "mongoose";
import { IEventCost } from "../interfaces/EventCost.interface";
import { EventCostType } from "../constants/enum";

const eventCostSchema = new Schema<IEventCost>({
  name: {
    type: String,
    required: true
  },
  price: { 
    type: Number,
    required: true
  },
  type: {
    type: Number,
    enum: EventCostType,
    default: EventCostType.IN_COME
  },
  note: { type: String },
  quantity: {
    type: Number,
    default: 0
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
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

const EventCost = model<IEventCost>('EventCost', eventCostSchema);
export default EventCost;
