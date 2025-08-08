import { Router } from "express";
import { TourController } from "./tour.controller";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createTourZodSchema } from "./tour.validations";

const router = Router();
router.post("/create",verifyToken(role.ADMIN, role.SUPER_ADMIN),validateRequest(createTourZodSchema), TourController.createTour);
router.get("/", TourController.getAllTours);
router.get("/:slug", TourController.getSingleTour);
router.post("/type/create", verifyToken(role.ADMIN, role.SUPER_ADMIN), TourController.createTourTypes);


export const TourRoutes = router;