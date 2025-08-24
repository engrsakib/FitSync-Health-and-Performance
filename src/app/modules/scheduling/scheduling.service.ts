import { Schedule } from "./scheduling.mode";


const createBlog = async (payload: Iblog) => {
  const BaseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${BaseSlug}-division`;
  const existingBlog = await Schedule.findOne({ where: { title: payload.title } });
  if (existingBlog) {
    throw new Error("Blog with this slug already exists");
  }
  let count = 0;
  while (await Schedule.exists({ slug })) {
    count++;
    slug = `${BaseSlug}-blog-${count}`;
  }
  payload.slug = slug;
  const blog = Schedule.create(payload);
  return blog;
};

const updateBlogs = async (id: string, payload: Partial<Iblog>) => {
  const blog = await Schedule.findById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }

  await Schedule.findByIdAndUpdate(id, payload, { new: true });
  return Schedule.findById(id);
};

const getAllBlogs = async () => {
  const blogs = await Schedule.find();
  return blogs;
};

const getSingleBlog = async (slug: string) => {
  const blog = await Schedule.findOne({ where: { slug } });
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
};

const deleteBlogs = async (id: string) => {
  const blog = await Schedule.findOne({ where: { id } });
  if (!blog) {
    throw new Error("Blog not found");
  }
  await Schedule.deleteOne({ where: { id } });
  return blog;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlogs,
  updateBlogs,
};
