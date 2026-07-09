import { Prisma } from "../../../generated/prisma/client";
import {
  PropertyStatus,
  Role,
  RentalStatus,
  UserStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  IAdminPropertyQuery,
  IAdminRentalQuery,
  IAdminUserQuery,
} from "./admin.interface";

const getAllUsers = async (query: IAdminUserQuery) => {
  const { role, status, searchTerm, page = "1", limit = "10" } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (role) {
    andConditions.push({ role: role as Role });
  }

  if (status) {
    andConditions.push({ status: status as UserStatus });
  }

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "email"].map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    meta: { page: pageNumber, limit: limitNumber, total },
    data: users,
  };
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

const getAllProperties = async (query: IAdminPropertyQuery) => {
  const {
    searchTerm,
    city,
    categoryId,
    status,
    page = "1",
    limit = "10",
  } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (status) {
    andConditions.push({ status: status as PropertyStatus });
  }

  if (city) {
    andConditions.push({ city: { equals: city, mode: "insensitive" } });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (searchTerm) {
    andConditions.push({
      OR: ["title", "description", "address", "city"].map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  const whereConditions: Prisma.PropertyWhereInput = { AND: andConditions };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        landlord: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.property.count({ where: whereConditions }),
  ]);

  return {
    meta: { page: pageNumber, limit: limitNumber, total },
    data: properties,
  };
};

const getAllRentalRequests = async (query: IAdminRentalQuery) => {
  const { status, page = "1", limit = "10" } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const whereConditions: Prisma.RentalRequestWhereInput = {
    ...(status && { status: status as RentalStatus }),
  };

  const [requests, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      include: {
        property: true,
        tenant: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.rentalRequest.count({ where: whereConditions }),
  ]);

  return {
    meta: { page: pageNumber, limit: limitNumber, total },
    data: requests,
  };
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};
