import { model, Schema } from "mongoose";
import { IEventCategories } from "../interfaces/EventCategories.interface";
import { Status } from "../constants/enum";

const eventCategoriesSchema = new Schema<IEventCategories>(
  {
    name: String,
    description: String,
    status: {
      type: Number,
      enum: Status,
      default: Status.ACTIVE
    }
  },
  { timestamps: true }
);

const EventCategories = model<IEventCategories>("EventCategories", eventCategoriesSchema);
export default EventCategories;
