import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument, IUserResponse } from "../interfaces/User.interface";
import jwt from 'jsonwebtoken';
import { Gender, Role, Status } from "../constants/enum";

const userSchema = new Schema<IUserDocument> (
	{
		name: { type: String, required: true },
		email: { 
			type: String, 
			required: true, 
			unique: true,
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
		},
		password: { type: String, required: true },
		role: { 
      type: String, 
      enum: Role, 
      default: Role.CUSTOMER 
    },
		status: {
			type: Number,
			enum: Status,
			default: Status.ACTIVE
		},
		dateOfBirth: Date,
		avatar: String,
		address: String,
		phone: {
			type: String,
			match: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/ // limit 10 number
		},
		gender: {
			type: String,
			enum: Object.values(Gender),
			default: Gender.OTHER
		},
		passwordChangedAt: Date,
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: function(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      }
		}
	}
);

// Middleware hash password
userSchema.pre<IUserDocument>('save', async function(next) {
	if(!this.isModified('password')) return next();
	try {
		const saltRounds = parseInt(process.env.SALT || '10', 10);
		const salt = await bcrypt.genSalt(saltRounds);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error: any) {
		next(error)
	}
});

// Method compare password
userSchema.methods.comparePassword = async function(
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
}

// Convert to response format
userSchema.methods.toResponse = function():IUserResponse {
	return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt.toISOString()
  };
};

userSchema.methods.generateAuthToken = function() {	
	return jwt.sign(
		{
			userId: this._id,
			role: this.role
		},
		process.env.JWT_SECRET!,
		{ expiresIn: '1d' }
	)
}

const User = model<IUserDocument>('User', userSchema);
export default User;
