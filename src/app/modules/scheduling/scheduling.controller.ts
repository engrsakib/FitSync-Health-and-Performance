import { Request, Response } from "express";
import AppError from "../../errorHelpers/appError";
import { BlogService } from "./scheduling.service";
import  httpStatus  from "http-status-codes";


const createBlog = async (req: Request, res: Response) => {
  try {
    const newBlog = await BlogService.createBlog(req.body);
    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    throw new AppError(`Failed to create blog: ${error}`, 500);
  }
};

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.status(200).json({
      message: "Blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve blogs: ${error}`, 500);
  }
};

const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await BlogService.getSingleBlog(slug);
    res.status(200).json({
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve blog: ${error}`, 500);
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedBlog = await BlogService.updateBlogs(id, req.body);
    res.status(httpStatus.OK).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    throw new AppError(`Failed to update blog: ${error}`, 500);
  }
};


const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await BlogService.deleteBlogs(id);
    res.status(204).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    throw new AppError(`Failed to delete blog: ${error}`, 500);
  }
};

export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
