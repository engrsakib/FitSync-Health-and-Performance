import { Router } from "express";
import { AuthController } from "./auth.controllers";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";


const router = Router();
router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout); // Assuming logout is handled similarly to login
router.post("/reset-password",verifyToken(role.ADMIN, role.TRAINEE, role.TRAINER) , AuthController.resetPassword); // Add forgot password route if needed
export const AuthRoutes = router;