import { calculateEndTime } from "../../util/schedule.utils";
import { Schedule } from "../scheduling/scheduling.mode";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";


export const createBooking = async (payload: IBooking) => {
  // ১. Check if schedule exists
  const schedule = await Schedule.findById(payload.schedule);
  if (!schedule) {
    throw new Error("Schedule not found.");
  }

  // ২. Check duplicate booking for same trainee & schedule
  const existingBooking = await Booking.findOne({
    schedule: payload.schedule,
    trainee: payload.trainee,
  });
  if (existingBooking) {
    throw new Error("Trainee already booked this schedule.");
  }

  // ৩. Check maxTrainees limit for the schedule
  const bookingCount = await Booking.countDocuments({
    schedule: payload.schedule,
    status: { $ne: "cancelled" }, // Exclude cancelled
  });

  const maxTrainees = schedule.maxTrainees ?? 10;
  if (bookingCount >= maxTrainees) {
    throw new Error("Schedule is full. No more bookings allowed.");
  }

  // ৪. (Optional) Check total bookings for the day for this schedule (limit 5 per day)
  // If you want to enforce: any schedule can be booked max 5 times per day
  const startOfDay = new Date(payload.bookingDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(payload.bookingDate);
  endOfDay.setHours(23, 59, 59, 999);

  const dailyBookingCount = await Booking.countDocuments({
    schedule: payload.schedule,
    bookingDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $ne: "cancelled" },
  });

  if (dailyBookingCount >= 5) {
    throw new Error("Booking limit exceeded: Maximum 5 bookings allowed per schedule per day.");
  }

  // ৫. Create booking
  const booking = await Booking.create(payload);
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
