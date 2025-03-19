import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument, IUserResponse } from "../interfaces/User.interface";
import jwt from 'jsonwebtoken';

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
      enum: ['admin', 'organizer', 'customer'], 
      default: 'customer' 
    },
		status: {
			type: Number,
			enum: [0, 1],
			default: 1
		}
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
		const salt = await bcrypt.genSalt(10);
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
