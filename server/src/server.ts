/* eslint-disable no-console */
import { Server } from "http";
// import { Request, Response } from "express";
import mongoose from "mongoose";

import app from "./app";
import envVar from "./app/config/envVar";



let server: Server;

const startServer = async (port: number): Promise<void> => {
  try {
    await mongoose.connect(envVar.DATABASE_URL);
    server = app.listen(port, () => {
      console.log("Connected to MongoDB");
      console.log(`Server is running on port ${port}`);
    });
  } catch (error: unknown) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer(Number(envVar.PORT) || 1000);

process.on("unhandledRejection", (error: Error) => {
  console.error("Unhandled Rejection:", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
