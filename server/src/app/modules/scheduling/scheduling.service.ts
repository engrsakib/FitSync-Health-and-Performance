import { calculateEndTime } from "../../util/schedule.utils";
import { ISchedule } from "./scheduling.interface";
import { Schedule } from "./scheduling.mode";


export const createSchedule = async (payload: ISchedule) => {
  const BaseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${BaseSlug}-schedule`;

  // নির্দিষ্ট তারিখে ৫টা শিডিউল আছে কিনা চেক
  const classDate = new Date(payload.classDate);
  // Start-of-day & end-of-day for the classDate
  const startOfDay = new Date(classDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(classDate);
  endOfDay.setHours(23, 59, 59, 999);

  const scheduleCount = await Schedule.countDocuments({
    classDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }); 

  if (scheduleCount >= 5) {
    throw new Error("Schedule limit exceeded: Maximum 5 schedules allowed per day.");
  }

  // Title duplicate check (case-insensitive)
  const existingSchedule = await Schedule.findOne({
    title: { $regex: new RegExp(`^${payload.title}$`, "i") },
  });
  if (existingSchedule) {
    throw new Error("Schedule with this title already exists.");
  }

  // Slug uniqueness
  let count = 0;
  while (await Schedule.exists({ slug })) {
    count++;
    slug = `${BaseSlug}-schedule-${count}`;
  }
  payload.slug = slug;

  // startTime থেকে ২ ঘণ্টা পরে endTime সেট করা
  if (payload.startTime) {
    payload.endTime = calculateEndTime(payload.startTime);
  }

  // Create schedule
  const schedule = await Schedule.create(payload);
  return schedule;
};


/**
 * Updates a schedule by ID. Ensures:
 * - Title duplicate validation (case-insensitive, excluding self)
 * - Day-wise maximum limit (if classDate is changed)
 * - Auto endTime calculation (if startTime updated)
 */
export const updateSchedule = async (id: string, payload: Partial<ISchedule>) => {
  const schedule = await Schedule.findById(id);
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

const getAllSchedules = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const schedules = await Schedule.find({
    classDate: { $gte: today },
  })
    .populate("trainer", "name")
    .sort({ classDate: 1 });

  return schedules;
};


const getSingleSchedule = async (slug: string) => {
  const schedule = await Schedule.findOne({ where: { slug } });
  if (!schedule) {
    throw new Error("Schedule not found");
  }
  return schedule;
};

const deleteSchedules = async (id: string) => {
  const schedule = await Schedule.findOne({ where: { id } });
  if (!schedule) {
    throw new Error("Schedule not found");
  }
  await Schedule.deleteOne({ where: { id } });
  return schedule;
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getSingleSchedule,
  deleteSchedules,
  updateSchedule,
};
