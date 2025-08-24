import { ISchedule } from "./scheduling.interface";
import { Schedule } from "./scheduling.mode";


const createSchedule = async (payload: ISchedule) => {
  const BaseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${BaseSlug}-division`;
  const existingSchedule = await Schedule.findOne({ where: { title: payload.title } });
  if (existingSchedule) {
    throw new Error("Schedule with this slug already exists");
  }
  let count = 0;
  while (await Schedule.exists({ slug })) {
    count++;
    slug = `${BaseSlug}-schedule-${count}`;
  }
  payload.slug = slug;
  const schedule = Schedule.create(payload);
  return schedule;
};

const updateSchedules = async (id: string, payload: Partial<ISchedule>) => {
  const schedule = await Schedule.findById(id);
  if (!schedule) {
    throw new Error("Schedule not found");
  }

  await Schedule.findByIdAndUpdate(id, payload, { new: true });
  return Schedule.findById(id);
};

const getAllSchedules = async () => {
  const schedules = await Schedule.find();
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
  updateSchedules,
};
