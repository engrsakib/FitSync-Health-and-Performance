// blogs.validation.ts
import { z } from "zod";
import { BlogCategory, BlogStatus } from "./scheduling.interface";

export const BlogCategoryEnum = z.nativeEnum(BlogCategory);
export const BlogStatusEnum = z.nativeEnum(BlogStatus);

export const createBlogZodSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  thumbnail: z.string().optional(),
  bannerImage: z.string().optional(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  status: BlogStatusEnum.optional(),
  category: BlogCategoryEnum,
  author: z.string(),
  readTime: z.number().optional(),
  publishedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  views: z.number().optional(),
  likes: z.number().optional(),
  commentsCount: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateBlogZodSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  thumbnail: z.string().optional(),
  bannerImage: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: BlogStatusEnum.optional(),
  category: BlogCategoryEnum.optional(),
  author: z.string().optional(),
  readTime: z.number().optional(),
  publishedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  views: z.number().optional(),
  likes: z.number().optional(),
  commentsCount: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// Optional inferred types
export type CreateBlogInput = z.infer<typeof createBlogZodSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogZodSchema>;
