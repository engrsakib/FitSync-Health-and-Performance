import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validations";
import { validateRequest } from "../../middleware/validateRequest";
import { verifyToken } from "../../util/verifyToken";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser,
);
router.get(
  "/",verifyToken("ADMIN", "SUPPERADMIN", "USER"),
  UserController.getAllUsers,
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  verifyToken("ADMIN", "SUPPERADMIN", "USER"),
  UserController.updateUser,
);
  
export const UserRoutes = router;
