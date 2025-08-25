import { JwtPayload } from "jsonwebtoken";
import { IsActive, IUser, role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";

const createUser = async (payload: Partial<IUser>) => {
  const { password, ...userData } = payload;

  if (!payload.email || !payload.password) {
    throw new Error("Email and password are required to create a user");
  }
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  );

  const user = new User({ ...userData, password: hashedPassword });
  const newUser = await User.create(user);
  return newUser;
};

// update user
const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const isUserExists = await User.findById(id);
  if (!isUserExists) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }
  if (isUserExists.isDeleted || isUserExists.isActive === IsActive.BLOCKED) {
    if (!decodedToken || !decodedToken.role) {
      throw new AppError("Unauthorized access", httpStatus.UNAUTHORIZED);
    }
  }

  if (!id) {
    throw new AppError(
      "User ID is required for updating user",
      httpStatus.FORBIDDEN,
    );
  }
  if (payload.role) {
    if (
      decodedToken.role !== role.ADMIN &&
      decodedToken.role !== role.TRAINER
    ) {
      throw new AppError(
        "You do not have permission to update user roles",
        httpStatus.FORBIDDEN,
      );
    }
    if (payload.role === role.ADMIN) {
      throw new AppError(
        "Cannot update user role to SUPERADMIN",
        httpStatus.FORBIDDEN,
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role !== role.ADMIN) {
      throw new AppError(
        "Only SUPERADMIN can update user active or deleted status",
        httpStatus.FORBIDDEN,
      );
    }
  }

  if (payload.password) {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );
    payload.password = hashedPassword;
  }

  const user = await User.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true, runValidators: true },
  );

  return user || null;
};

const getAllUsers = async () => {
  const users = await User.find();
  if (!users || users.length === 0) {
    throw new Error("No users found");
  }
  const userCount = await User.countDocuments();
  return { users, userCount };
};

const getUserByRole = async (role: string) => {
  const users = await User.find({ role });
  if (!users || users.length === 0) {
    throw new Error("No users found");
  }
  return users;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
  getUserByRole,
};
