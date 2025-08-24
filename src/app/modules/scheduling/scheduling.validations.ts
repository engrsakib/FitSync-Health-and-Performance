import { z } from "zod";
import { ScheduleStatus } from "./scheduling.interface";

// Native enum for ScheduleStatus
export const ScheduleStatusEnum = z.nativeEnum(ScheduleStatus);

export const createScheduleZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be a string." })
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title cannot exceed 100 characters." }),
  description: z
    .string({ invalid_type_error: "Description must be a string." })
    .max(500, { message: "Description cannot exceed 500 characters." })
    .optional(),
  slug: z
    .string({ invalid_type_error: "Slug must be a string." })
    .min(2, { message: "Slug must be at least 2 characters." })
    .max(100, { message: "Slug cannot exceed 100 characters." }).optional(),
  trainer: z
    .string({ invalid_type_error: "Trainer ID must be a string." })
    .min(10, { message: "Trainer ID must be at least 10 characters." }).optional(),
  trainees: z
    .array(z.string().min(10, "Trainee ID must be at least 10 characters."))
    .max(10, { message: "Maximum 10 trainees allowed per schedule." })
    .optional(),
  classDate: z.coerce.date({ invalid_type_error: "classDate must be a valid date." }),
  startTime: z
    .string({ invalid_type_error: "startTime must be a string." })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "startTime must be in HH:mm 24hr format.",
    }),
  endTime: z
    .string({ invalid_type_error: "endTime must be a string." })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "endTime must be in HH:mm 24hr format.",
    }).optional(),
  status: ScheduleStatusEnum.optional(),
  maxTrainees: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional(),
  isFull: z.boolean().optional(),
  createdBy: z
    .string({ invalid_type_error: "Admin ID (createdBy) must be a string." })
    .min(10, { message: "Admin ID must be at least 10 characters." }),
  isCancelled: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
  notes: z.string().max(500).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const updateScheduleZodSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  trainer: z.string().min(10).optional(),
  trainees: z.array(z.string().min(10)).max(10).optional(),
  classDate: z.coerce.date().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  status: ScheduleStatusEnum.optional(),
  maxTrainees: z.number().int().min(1).max(10).optional(),
  isFull: z.boolean().optional(),
  createdBy: z.string().min(10).optional(),
  isCancelled: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
  notes: z.string().max(500).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Optional inferred types
export type CreateScheduleInput = z.infer<typeof createScheduleZodSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleZodSchema>;