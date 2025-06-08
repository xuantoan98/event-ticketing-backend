import { model, Schema } from "mongoose";
import { IInvites } from "../interfaces/Invite.interface";
import { Status } from "../constants/enum";

const inviteSchema = new Schema<IInvites>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
		match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  phone: {
    type: String,
    required: true,
    match: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/ // limit 10 number
  },
  fax: {
    type: String
  },
  organization: {
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

const Invite = model<IInvites>("Invite", inviteSchema);
export default Invite;
