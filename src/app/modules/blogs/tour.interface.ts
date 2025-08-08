import { Types } from "mongoose";

export interface Itour{
    id?: string;
    name: string;
    slug: string;
    images?: string[];
    thumbnail?: string;
    location?: string;
    costFrom?: number;
    costTo?: number;
    startDate?: Date;
    endDate?: Date;
    included?: string[];
    excluded?: string[];
    amenities?: string[];
    itinerary?: string;
    tourPlan?: string[];
    maxGests?: number;
    gestCount?: number;
    minAge?: number;
    maxAge?: number;
    division: Types.ObjectId;
    tourType: Types.ObjectId;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive?: boolean;
}

export interface ItourType {
    name: string;
    
}