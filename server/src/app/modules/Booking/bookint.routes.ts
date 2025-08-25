import { Router } from "express";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookingZodSchema } from "./booking.validations";
import { BookingController } from "./booking.controller";

const router = Router();
router.post("/create",verifyToken(role.ADMIN),validateRequest(createBookingZodSchema), BookingController.createScheduling);
router.get("/", BookingController.getAllSchedulings);
router.get("/:id", BookingController.getSingleScheduling);

router.patch("/:id", verifyToken(role.ADMIN), BookingController.cancelScheduling);

export const BookingRoutes = router;