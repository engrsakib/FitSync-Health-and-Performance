import { Router } from "express";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createScheduleZodSchema, updateScheduleZodSchema } from "./scheduling.validations";
import { SchedulingController } from "./scheduling.controller";


const router = Router();
router.post("/create",verifyToken(role.ADMIN),validateRequest(createScheduleZodSchema), SchedulingController.createScheduling);
router.get("/", SchedulingController.getAllSchedulings);
router.get("/:slug", SchedulingController.getSingleScheduling);
router.patch("/:id", verifyToken(role.ADMIN), validateRequest(updateScheduleZodSchema), SchedulingController.updateScheduling);
router.delete("/:id", verifyToken(role.ADMIN), SchedulingController.deleteScheduling);

export const SchedulingRoutes = router;