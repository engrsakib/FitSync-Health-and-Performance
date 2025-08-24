import { Types } from "mongoose";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export interface IBooking {
  id?: string;
  schedule: Types.ObjectId;           // Reference to the scheduled class
  trainee: Types.ObjectId;            // User who is booking the schedule
  bookingDate: Date;                  // When the booking was made
  status?: BookingStatus;             // Booking status
  attended?: boolean;                 // If trainee attended the session
  cancelledBy?: Types.ObjectId;       // User/Admin who cancelled (optional)
  cancelledAt?: Date;                 // When cancelled (optional)
  completedAt?: Date;                 // When completed (optional)
  notes?: string;                     // Any notes about the booking
  createdAt: Date;
  updatedAt: Date;
}