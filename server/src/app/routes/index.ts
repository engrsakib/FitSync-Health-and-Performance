import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SchedulingRoutes } from "../modules/scheduling/scheduling.routes";
import { BookingRoutes } from "../modules/Booking/bookint.routes";


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
    route: SchedulingRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);


});
