import * as bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { UserProfile } from "@prisma/client";
import { TUserData } from "./user.interface";

const createUser = async (data: TUserData) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);
  const userData = {
    username: data.username,
    email: data.email,
    role: data.role,
    password: hashedPassword,
  };

  const result = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getUser = async (id: string) => {
  const result = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: id,
    },
  });
  return result;
};

const updateUser = async (id: string, userData: Partial<UserProfile>) => {
  const result = await prisma.userProfile.update({
    where: {
      userId: id,
    },
    data: userData,
  });
  return result;
};

export const userServices = {
  createUser,
  getUser,
  updateUser,
};
