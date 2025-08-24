import { model, Schema, Types } from "mongoose";
import { IsActive, IUser, role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    role: {
      type: String,
      enum: Object.values(role),
      default: role.TRAINEE,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false }, // spelling fixed!
    auth: [
      {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
      },
    ],
    bookings: [{ type: Types.ObjectId, ref: "Booking" }], // pluralized for clarity
    trainerGuide: { type: Types.ObjectId, ref: "Guide", default: null }, // renamed for clarity
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  },
);

export const User = model<IUser>("User", userSchema);