import { Schema, model } from "mongoose";
import { ISchedule, ScheduleStatus } from "./scheduling.interface";

const scheduleSchema = new Schema<ISchedule>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    trainees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    classDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ScheduleStatus),
      default: ScheduleStatus.SCHEDULED,
    },
    maxTrainees: {
      type: Number,
      default: 10,
      min: 1,
      max: 10,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Schedule = model<ISchedule>("Schedule", scheduleSchema);