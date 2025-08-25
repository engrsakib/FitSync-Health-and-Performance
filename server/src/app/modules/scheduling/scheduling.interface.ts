import { Types } from "mongoose";

export enum ScheduleStatus {
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export interface ISchedule {
  id?: string;
  title: string;
    slug?: string;
  description?: string;
  trainer: Types.ObjectId;        // Assigned trainer for the class
  trainees: Types.ObjectId[];     // List of trainees booked for this schedule
  classDate: Date;                // Date of the scheduled class
  startTime: string;              // "HH:mm" format for class start time
  endTime?: string;                // "HH:mm" format for class end time
  status?: ScheduleStatus;        // Current status of the schedule
  maxTrainees?: number;           // Default: 10 trainees per schedule
  isFull?: boolean;               // true if maxTrainees reached
  createdBy: Types.ObjectId;      // Admin who created the schedule
  createdAt: Date;
  updatedAt: Date;
  isCancelled?: boolean;
  isCompleted?: boolean;
  notes?: string;
}