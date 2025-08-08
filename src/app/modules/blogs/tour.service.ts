import { Itour, ItourType } from "./tour.interface";
import { Tour, TourType } from "./tour.mode";

const createTour = async (payload: Itour) => {
  const BaseSlug = payload.name.toLowerCase().split(" ").join("-");
  let slug = `${BaseSlug}-division`;
  const existingTour = await Tour.findOne({ where: { name: payload.name } });
  if (existingTour) {
    throw new Error("Tour with this slug already exists");
  }
  let count = 0;
  while (await Tour.exists({ slug })) {
    count++;
    slug = `${BaseSlug}-tour-${count}`;
  }
  payload.slug = slug;
  payload.isActive = true;
  const tour = Tour.create(payload);
  return tour;
};

const getAllTours = async () => {
  const tours = await Tour.find();
  return tours;
};

const getSingleTour = async (slug: string) => {
  const tour = await Tour.findOne({ where: { slug } });
  if (!tour) {
    throw new Error("Tour not found");
  }
  return tour;
};

const createTourTypes = async (payload: ItourType) => {
  const existingTourType = await TourType.findOne({ where: { name: payload.name } });
  if (existingTourType) {
    throw new Error("Tour type with this name already exists");
  }
  const tourType = TourType.create(payload);
  return tourType;
};

export const TourService = {
  createTour,
  getAllTours,
  getSingleTour,
  createTourTypes,
};
