import { Request, Response } from "express";
import AppError from "../../errorHelpers/appError";
import { TourService } from "./tour.service";


const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await TourService.createTour(req.body);
    res.status(201).json({
      message: "Tour created successfully",
      tour: newTour,
    });
  } catch (error) {
    throw new AppError(`Failed to create tour: ${error}`, 500);
  }
};

const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await TourService.getAllTours();
    res.status(200).json({
      message: "Tours retrieved successfully",
      data:tours,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve tours: ${error}`, 500);
  }
};

const getSingleTour = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const tour = await TourService.getSingleTour(slug);
    res.status(200).json({
      message: "Tour retrieved successfully",
      data: tour,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve tour: ${error}`, 500);
  }
};

const createTourTypes = async (req: Request, res: Response) => {
  try {
    const newTourType = await TourService.createTourTypes(req.body);
    res.status(201).json({
      message: "Tour type created successfully",
      tourType: newTourType,
    });
  } catch (error) {
    throw new AppError(`Failed to create tour type: ${error}`, 500);
  }
};

export const TourController = {
  createTour,
  getAllTours,
  getSingleTour,
  createTourTypes,
};
