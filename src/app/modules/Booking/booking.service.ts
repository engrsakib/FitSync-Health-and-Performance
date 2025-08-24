import { calculateEndTime } from "../../util/schedule.utils";
import { Schedule } from "../scheduling/scheduling.mode";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
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
export const updateBooking = async (id: string, payload: Partial<IBooking>) => {
  const schedule = await Booking.findById(id);
  if (!schedule) {
    throw new Error("Schedule not found");
  }

  // Title duplicate check (ignore self)
  if (payload.title && payload.title !== schedule.title) {
    const existingSchedule = await Schedule.findOne({
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${payload.title}$`, "i") },
    });
    if (existingSchedule) {
      throw new Error("Schedule with this title already exists.");
    }
  }

  // If classDate is being changed, check for daily schedule limit
  if (payload.classDate && payload.classDate !== schedule.classDate) {
    const classDate = new Date(payload.classDate);
    const startOfDay = new Date(classDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(classDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Exclude current schedule from the count
    const scheduleCount = await Schedule.countDocuments({
      classDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      _id: { $ne: id },
    });

    if (scheduleCount >= 5) {
      throw new Error("Schedule limit exceeded: Maximum 5 schedules allowed per day.");
    }
  }

  // Auto set endTime if startTime is updated
  if (payload.startTime) {
    payload.endTime = calculateEndTime(payload.startTime);
  }

  await Schedule.findByIdAndUpdate(id, payload, { new: true });
  return Schedule.findById(id);
};

const getAllBookings = async () => {
  const bookings = await Booking.find();
  return bookings;
};

const getSingleBooking = async (slug: string) => {
  const booking = await Booking.findOne({ where: { slug } });
  if (!booking) {
    throw new Error("Booking not found");
  }
  return booking;
};

const deleteBookings = async (id: string) => {
  const booking = await Booking.findOne({ where: { id } });
  if (!booking) {
    throw new Error("Booking not found");
  }
  await Booking.deleteOne({ where: { id } });
  return booking;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  deleteBookings,
  updateBookings,
};
