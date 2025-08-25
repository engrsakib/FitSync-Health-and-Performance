import express, { Express, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import notFoundMiddleware from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandeler";
import cookieParser from "cookie-parser";
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome to the Tour Management System");
});

app.use(globalErrorHandler);
// Handle 404 Not Found
app.use(notFoundMiddleware);

export default app;
