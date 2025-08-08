import { model, Schema } from "mongoose";
import { Itour, ItourType } from "./tour.interface";

const tourTypeSchema = new Schema<ItourType>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
},{
  timestamps: true,
  versionKey: false,
});


const TourType = model<ItourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<Itour>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    costFrom: {
      type: Number,
      default: 0,
    },
    costTo: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: String,
      default: null,
    },
    tourPlan: {
      type: [String],
      default: [],
    },
    maxGests: {
      type: Number,
      default: 0,
    },
    gestCount: {
      type: Number,
      default: 0,
    },
    minAge: {
      type: Number,
      default: 0,
    },
    maxAge: {
      type: Number,
      default: 100,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Tour = model<Itour>("Tour", tourSchema);
export { TourType, tourTypeSchema };
