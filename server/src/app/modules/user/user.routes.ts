import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validations";
import { validateRequest } from "../../middleware/validateRequest";
import { verifyToken } from "../../util/verifyToken";
import { role } from "./user.interface";

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

router.get(
  "/role/:role",
  verifyToken(role.ADMIN, role.TRAINEE, role.TRAINER),
  UserController.getAllUsersByRole,
);

export const UserRoutes = router;
