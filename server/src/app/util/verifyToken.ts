import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (...authRole: string[]) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const acccessToken = req.headers.authorization;
    if (!acccessToken) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }
    const verifiedToken = jwt.verify(
      acccessToken,
      process.env.JWT_SECRET as string,
    );
    if (!verifiedToken) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    // Optionally, you can check if the user is an admin
    if (!authRole.includes((verifiedToken as jwt.JwtPayload).role)) {
      res.status(403).json({ message: "You do not have permission to access this resource/routes" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access " + error });
    return;
  }
};
