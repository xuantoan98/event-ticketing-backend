import { Schema, model } from "mongoose";
import { IEvent } from "../interfaces/Event.interface";
import { EventLimitSeat, EventStatus } from "../constants/enum";

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
  isLimitSeat: {
    type: Number,
    enum: Object.values(EventLimitSeat),
    default: EventLimitSeat.NO_LIMIT
  },
  totalSeats: {
    type: Number,
    default: 0,
    validate: {
      validator: (value: number) => value >= 0,
      message: '{PATH} phải lớn hơn hoặc bằng 0'
    }
  },
  totalCustomerInvites: {
    type: Number,
    default: 0
  },
  totalSupports: {
    type: Number,
    default: 0
  },
  totalDetails: Number,
  totalCosts: {
    type: Number,
    default: 0
  },
  totalFeedbacks: {
    type: Number,
    default: 0
  },
  estimatePrice: {
    type: Number,
    default: 0,
    validate: {
      validator: (value: number) => value >= 0,
      message: '{PATH} phải lớn hơn hoặc bằng 0'
    }
  },
  realPrice: {
    type: Number,
    default: 0,
    validate: {
      validator: (value: number) => value >= 0,
      message: '{PATH} phải lớn hơn hoặc bằng 0'
    }
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
}, {
  timestamps: true 
});

// Thêm virtual property để tính toán duration
eventSchema.virtual('durationHours').get(function() {
  const diffMs = this.endDate.getTime() - this.startDate.getTime();
  return Math.round(diffMs / (1000 * 60 * 60));
});

const Event = model<IEvent>('Event', eventSchema);
export default Event;
