import mongoose, { Schema, Document, Model } from 'mongoose'
import { USER_DEPARTMENTS } from '../../app/constants/user/userDepartments'
import type { IUser } from '../types/user/user'

interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema<IUserDocument>(
  {
    firebaseId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: USER_DEPARTMENTS,
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    joined: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)


const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema)

export default User

