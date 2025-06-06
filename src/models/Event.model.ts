import { Schema, model } from "mongoose";
import { IEvent } from "../interfaces/Event.interface";
import { EventStatus } from "../constants/enum";

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true,
    minlength: 50
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: IEvent, value: Date) {
        return value > this.startDate;
      },
      message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
    }
  },
  location: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/600x400'
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.CREATE
  },
  ticketsId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  eventCategoriesId: [{
    type: Schema.Types.ObjectId,
    ref: 'EventCategories',
    require: true
  }],
  isLimitSeat: Number,
  totalSeats: Number,
  totalCustomerInvites: Number,
  totalSupports: Number,
  totalDetails: Number,
  totalCosts: Number,
  totalFeedbacks: Number,
  estimatePrice: Number,
  realPrice: Number,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
}, {
  timestamps: true 
});

// Thêm virtual property để tính toán duration
eventSchema.virtual('durationHours').get(function() {
  const diffMs = this.endDate.getTime() - this.startDate.getTime();
  return Math.round(diffMs / (1000 * 60 * 60));
});

const Event = model<IEvent>("Event", eventSchema);
export default Event;
