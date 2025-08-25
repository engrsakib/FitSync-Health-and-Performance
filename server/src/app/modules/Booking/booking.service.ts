import { Schedule } from "../scheduling/scheduling.mode";
import { User } from "../user/user.model";
import { BookingStatus, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";


export const createBooking = async (payload: IBooking) => {
  // ১. Check if schedule exists
  const schedule = await Schedule.findById(payload.schedule);
  if (!schedule) {
    throw new Error("Schedule not found.");
  }

  // ২. Check if user already booked this schedule (trainee can't book twice)
  // Check in Booking collection
  const existingBooking = await Booking.findOne({
    schedule: payload.schedule,
    trainee: payload.trainee,
  });
  if (existingBooking) {
    throw new Error("You have already booked this schedule.");
  }

  // ৩. Check if schedule is full (max 10 trainees)
  // Use schedule.trainees array length
  const maxTrainees = schedule.maxTrainees ?? 10;
  const currentTrainees = schedule.trainees?.length ?? 0;
  if (currentTrainees >= maxTrainees) {
    throw new Error("The schedule is full. No more bookings allowed.");
  }

  // ৪. Create booking
  const booking = await Booking.create(payload);

  // ৫. Update User: push booking._id into user's bookings array
  await User.findByIdAndUpdate(
    payload.trainee,
    { $push: { bookings: booking._id } },
    { new: true },
  );

  // ৬. Update Schedule: push trainee._id into schedule.trainees array
  await Schedule.findByIdAndUpdate(
    payload.schedule,
    { $push: { trainees: payload.trainee } },
    { new: true },
  );

  return booking;
};


/**
 * Updates a schedule by ID. Ensures:
 * - Title duplicate validation (case-insensitive, excluding self)
 * - Day-wise maximum limit (if classDate is changed)
 * - Auto endTime calculation (if startTime updated)
 */


const getAllBookings = async () => {
  const bookings = await Booking.find();
  return bookings;
};

const getSingleBooking = async (id: string) => {
  const booking = await Booking.findOne({ where: { id } });
  if (!booking) {
    throw new Error("Booking not found");
  }
  return booking;
};

const cancelBookings = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new Error("Booking not found");
  }

  booking.status = BookingStatus.CANCELLED;
  booking.attended = false;
  booking.cancelledAt = new Date();

  await booking.save();
  return booking;
};

const getBookingByTrainer = async (trainerId: string) => {
  const bookings = await Booking.find({ trainer: trainerId });
  return bookings;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  cancelBookings,
  getBookingByTrainer,
};
