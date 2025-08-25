import { Router } from "express";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createScheduleZodSchema, updateScheduleZodSchema } from "./scheduling.validations";
import { SchedulingController } from "./scheduling.controller";


const router = Router();
router.post("/create",verifyToken(role.ADMIN),validateRequest(createScheduleZodSchema), SchedulingController.createScheduling);
router.get("/", verifyToken(role.ADMIN, role.TRAINEE, role.TRAINER), SchedulingController.getAllSchedulings);
router.get("/:slug", verifyToken(role.ADMIN, role.TRAINEE, role.TRAINER), SchedulingController.getSingleScheduling);
router.patch("/:id", verifyToken(role.ADMIN), validateRequest(updateScheduleZodSchema), SchedulingController.updateScheduling);
router.delete("/:id", verifyToken(role.ADMIN), SchedulingController.deleteScheduling);
router.get("/trainer/:trainerId", verifyToken(role.ADMIN, role.TRAINEE, role.TRAINER), SchedulingController.getAllSchedulesByTrainer);

export const SchedulingRoutes = router;