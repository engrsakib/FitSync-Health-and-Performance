import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BlogsRoutes } from "../modules/scheduling/scheduling.routes";


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
    path: "/scheduling",
    route: BlogsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);


});
