import { Router } from "express";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookingZodSchema } from "./booking.validations";

const router = Router();
router.post("/create",verifyToken(role.ADMIN),validateRequest(createBookingZodSchema), SchedulingController.createScheduling);
router.get("/", SchedulingController.getAllSchedulings);
router.get("/:slug", SchedulingController.getSingleScheduling);
router.patch("/:id", verifyToken(role.ADMIN), validateRequest(updateScheduleZodSchema), SchedulingController.updateScheduling);
router.delete("/:id", verifyToken(role.ADMIN), SchedulingController.deleteScheduling);

export const BookingRoutes = router;