import { model, Schema } from "mongoose";
import { IEventCategories } from "../interfaces/EventCategories.interface";
import { Status } from "../constants/enum";

const eventCategoriesSchema = new Schema<IEventCategories>(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
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
  },
  { timestamps: true }
);

const EventCategories = model<IEventCategories>('EventCategories', eventCategoriesSchema);
export default EventCategories;
