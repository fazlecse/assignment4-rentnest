import bcrypt from "bcryptjs";
import { ILoginUser, RegisterAuthPayload } from "./auth.interface";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserIntoDB = async (payload: RegisterAuthPayload) => {
  const { name, email, password, role, profileImage } = payload;
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    throw new Error("User with this email already exists!");
  }
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profileImage,
      role,
    },
    omit: { password: true },
  });
  return createdUser;
};

const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });
  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contect support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }
  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });
  return user;
};

export const authService = {
  registerUserIntoDB,
  loginUserIntoDB,
  getMyProfileFromDB,
};
