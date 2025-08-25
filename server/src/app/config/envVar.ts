import dotenv from "dotenv";

dotenv.config();

const envVar = {
  PORT: process.env.PORT || 3000 as number,
  DATABASE_URL: process.env.DATABASE_URL as string || "mongodb://localhost:27017/tour-management",
  NODE_ENV: process.env.NODE_ENV as string || "development",
};

export default envVar;
