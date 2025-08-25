/* eslint-disable no-console */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import AppError from "../../errorHelpers/appError";
import { sendResponse } from "../../util/sendResponse";
import { verifyToken } from "../../util/verifyToken";
import { JwtPayload } from "jsonwebtoken";


/**
 * UserController handles user-related requests.
 * It contains methods for creating a user.
 */
const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await UserService.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user: newUser,
    });
  
  } catch (error) {
    console.log(error);
    throw new AppError("Failed to create user", httpStatus.INTERNAL_SERVER_ERROR);
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization;
    const isTokenValid = verifyToken(token as string,"ADMIN", "SUPPERADMIN", "USER") as JwtPayload;
    if (!isTokenValid) {
      throw new AppError("Unauthorized access", httpStatus.UNAUTHORIZED);
    }
    const updatedUser = await UserService.updateUser(id, req.body, isTokenValid);
    res.status(httpStatus.OK).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  
  } catch (error) {
    console.log(error);
    throw new AppError("Failed to update user", httpStatus.INTERNAL_SERVER_ERROR);
  }
};


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
   
    sendResponse(res, {
      success: true,
      message: "Users retrieved successfully",
      status: httpStatus.OK,
      data: users?.users,
      metadata: {
        totalCount: users?.userCount || 0,
      },
    });
  } catch (error) {
    console.log(error);
    throw new AppError("Failed to retrieve users", httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * UserController exports the methods to be used in routes.
 */

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
