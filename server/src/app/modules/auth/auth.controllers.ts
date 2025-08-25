import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../util/sendResponse";
import { AuthService } from "./auth.service";


const credentialsLogin = async (req: Request, res: Response) => {

  const loginInfo = await AuthService.credentialsLogin(req.body);
  // Set cookies for access and refresh tokens
  res.cookie("accessToken", loginInfo.acccessToken, {
    httpOnly: true,
    secure: false, // Set secure flag in production
  });
  // Set refresh token in cookies
  res.cookie("refreshToken", loginInfo.refreshToken, {
    httpOnly: true,
    secure: false, // Set secure flag in production
  });
  sendResponse(res, {
    success: true,
    message: "Login successful",
    status: httpStatus.OK,
    data: loginInfo ,
  });
};
const getNewAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
 
  const tokenInfo = await AuthService.getNewAccessToken(refreshToken);
  sendResponse(res, {
    success: true,
    message: "New access token generated successfully",
    status: httpStatus.OK,
    data: tokenInfo ,
  });
};

const logout = async (req: Request, res: Response) => {
  // Clear cookies
  res.clearCookie("accessToken",{
    httpOnly: true,
    secure: false, // Set secure flag in production
    sameSite: "lax", // Adjust as needed
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // Set secure flag in production
    sameSite: "lax", // Adjust as needed
  });

  sendResponse(res, {
    success: true,
    message: "Logged out successfully",
    status: httpStatus.OK,
  });
};

const resetPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    sendResponse(res, {
      success: false,
      message: "Access token is required",
      status: httpStatus.UNAUTHORIZED,  
    });
  }

  const result = await AuthService.resetPassword(oldPassword, newPassword, accessToken);
  sendResponse(res, {
    success: true,
    message: "Password reset successfully",
    status: httpStatus.OK,
    data: result,
  });
};

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
