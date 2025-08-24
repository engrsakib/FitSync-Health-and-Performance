import { Types } from "mongoose";

export enum role {
  TRAINER = "TRAINER",
  ADMIN = "ADMIN",
  TRAINEE = "TRAINEE",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface IAuth {
  provider: string;
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: role;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  auth: IAuth[];
  bookings?: Types.ObjectId[];    // Changed to plural for semantic clarity
  trainerGuide?: Types.ObjectId;  // Renamed for clarity (if this means a trainer's guide/mentor)
}