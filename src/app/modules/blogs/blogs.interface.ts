import { Types } from "mongoose";

export enum BlogStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

export enum BlogCategory {
    POEM = "poem",
    STORY = "story",
    LIFESTYLE = "lifestyle",
    ISLAMIC = "islamic",
    SIRAH = "sirah",
    HADITH = "hadith",
    TECHNOLOGY = "technology",
}

export interface Iblog {
    id?: string;
    title: string;
    slug: string;
    thumbnail?: string;
    bannerImage?: string;
    content: string;
    tags?: string[];
    status?: BlogStatus;
    category: BlogCategory;
    author: Types.ObjectId;
    readTime?: number; // in minutes
    publishedAt: Date;
    updatedAt: Date;
    isPublished?: boolean;
    isFeatured?: boolean;
    views?: number;
    likes?: number;
    commentsCount?: number;
    seoTitle?: string;
    seoDescription?: string;
}
