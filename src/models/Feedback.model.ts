import { model, Schema } from "mongoose";
import { IFeedback } from "../interfaces/Feedback.interface";

const feedbackSchema = new Schema<IFeedback>({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
		match: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/ // limit 10 number
  },
  email: {
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  point: {
    type: Number,
    default: 0
  },
  content: {
    type: String
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

const Feedback = model<IFeedback>('Feedback', feedbackSchema);
export default Feedback;
