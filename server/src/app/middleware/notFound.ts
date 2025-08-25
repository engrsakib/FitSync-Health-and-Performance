
import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: "error",
    message: "Not Found",
  });
};

export default notFoundMiddleware;
