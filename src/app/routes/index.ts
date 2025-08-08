import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BlogsRoutes } from "../modules/blogs/blogs.routes";


export const router = Router();



const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  
  {
    path: "/blogs",
    route: BlogsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);


});
