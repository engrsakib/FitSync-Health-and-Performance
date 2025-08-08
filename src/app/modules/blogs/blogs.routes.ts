import { Router } from "express";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { BlogController } from "./blogs.controller";
import { createBlogZodSchema } from "./blogs.validations";

const router = Router();
router.post("/create",verifyToken(role.ADMIN, role.SUPER_ADMIN),validateRequest(createBlogZodSchema), BlogController.createBlog);
router.get("/", BlogController.getAllBlogs);
router.get("/:slug", BlogController.getSingleBlog);
router.patch("/:id", verifyToken(role.ADMIN, role.SUPER_ADMIN), validateRequest(createBlogZodSchema), BlogController.updateBlog);
router.delete("/:id", verifyToken(role.ADMIN, role.SUPER_ADMIN), BlogController.deleteBlog);

export const BlogsRoutes = router;