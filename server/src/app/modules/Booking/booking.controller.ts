import { Request, Response } from "express";
import AppError from "../../errorHelpers/appError";
import  httpStatus  from "http-status-codes";
import { BookingService } from "./booking.service";
import { ScheduleService } from "../scheduling/scheduling.service";


const createScheduling = async (req: Request, res: Response) => {
  try {
    const newScheduling = await BookingService.createBooking(req.body);
    res.status(httpStatus.CREATED).json({
      message: "Scheduling created successfully",
      scheduling: newScheduling,
    });
  } catch (error) {
    throw new AppError(`Failed to create scheduling: ${error}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const getAllSchedulings = async (req: Request, res: Response) => {
  try {
    const schedulings = await ScheduleService.getAllSchedules();
    res.status(httpStatus.OK).json({
      message: "Schedulings retrieved successfully",
      data: schedulings,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve schedulings: ${error}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const getSingleScheduling = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scheduling = await ScheduleService.getSingleSchedule(id);
    res.status(200).json({
      message: "Scheduling retrieved successfully",
      data: scheduling,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve scheduling: ${error}`, 500);
  }
};



const cancelScheduling = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await BookingService.cancelBookings(id);
    res.status(httpStatus.NO_CONTENT).json({
      message: "Scheduling deleted successfully",
    });
  } catch (error) {
    throw new AppError(`Failed to delete scheduling: ${error}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const BookingController = {
  createScheduling,
  getAllSchedulings,
  getSingleScheduling,
  cancelScheduling,
};
