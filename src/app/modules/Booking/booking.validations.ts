import { z } from "zod";
import { BookingStatus } from "./booking.interface";

// Native enum for BookingStatus
export const BookingStatusEnum = z.nativeEnum(BookingStatus);

export const createBookingZodSchema = z.object({
  schedule: z
    .string({ invalid_type_error: "Schedule ID must be a string." })
    .min(10, { message: "Schedule ID must be at least 10 characters." }),
  trainee: z
    .string({ invalid_type_error: "Trainee ID must be a string." })
    .min(10, { message: "Trainee ID must be at least 10 characters." }),
  bookingDate: z.coerce.date({ invalid_type_error: "Booking date must be a valid date." }),
  status: BookingStatusEnum.optional(),
  attended: z.boolean().optional(),
  cancelledBy: z
    .string({ invalid_type_error: "CancelledBy must be a string." })
    .min(10, { message: "CancelledBy ID must be at least 10 characters." })
    .optional(),
  cancelledAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const updateBookingZodSchema = z.object({
  schedule: z.string().min(10).optional(),
  trainee: z.string().min(10).optional(),
  bookingDate: z.coerce.date().optional(),
  status: BookingStatusEnum.optional(),
  attended: z.boolean().optional(),
  cancelledBy: z.string().min(10).optional(),
  cancelledAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Optional inferred types
export type CreateBookingInput = z.infer<typeof createBookingZodSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingZodSchema>;