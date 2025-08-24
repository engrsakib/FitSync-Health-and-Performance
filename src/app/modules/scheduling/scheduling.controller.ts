import { Request, Response } from "express";
import AppError from "../../errorHelpers/appError";
import {  ScheduleService } from "./scheduling.service";
import  httpStatus  from "http-status-codes";


const createScheduling = async (req: Request, res: Response) => {
  try {
    const newScheduling = await ScheduleService.createSchedule(req.body);
    res.status(201).json({
      message: "Scheduling created successfully",
      scheduling: newScheduling,
    });
  } catch (error) {
    throw new AppError(`Failed to create scheduling: ${error}`, 500);
  }
};

const getAllSchedulings = async (req: Request, res: Response) => {
  try {
    const schedulings = await ScheduleService.getAllSchedules();
    res.status(200).json({
      message: "Schedulings retrieved successfully",
      data: schedulings,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve schedulings: ${error}`, 500);
  }
};

const getSingleScheduling = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const scheduling = await ScheduleService.getSingleSchedule(slug);
    res.status(200).json({
      message: "Scheduling retrieved successfully",
      data: scheduling,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve scheduling: ${error}`, 500);
  }
};

const updateScheduling = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedScheduling = await ScheduleService.updateSchedules(id, req.body);
    res.status(httpStatus.OK).json({
      message: "Scheduling updated successfully",
      data: updatedScheduling,
    });
  } catch (error) {
    throw new AppError(`Failed to update scheduling: ${error}`, 500);
  }
};


const deleteScheduling = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ScheduleService.deleteSchedules(id);
    res.status(204).json({
      message: "Scheduling deleted successfully",
    });
  } catch (error) {
    throw new AppError(`Failed to delete scheduling: ${error}`, 500);
  }
};

export const SchedulingController = {
  createScheduling,
  getAllSchedulings,
  getSingleScheduling,
  updateScheduling,
  deleteScheduling,
};
