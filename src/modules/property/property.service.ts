import { Prisma } from "../../../generated/prisma/client";
import { PropertyStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyPayload,
  IPropertyQuery,
  IUpdatePropertyPayload,
} from "./property.interface";

const createProperty = async (
  userId: string,
  payload: ICreatePropertyPayload,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const property = prisma.property.create({
    data: {
      ...payload,
      landlordId: userId,
    },
  });
  return property;
};

const getAllProperties = async (query: IPropertyQuery) => {
  const {
    searchTerm,
    city,
    categoryId,
    minRent,
    maxRent,
    bedrooms,
    bathrooms,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "10",
  } = query;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  andConditions.push({
    status: status ? (status as PropertyStatus) : PropertyStatus.AVAILABLE,
  });

  if (searchTerm) {
    andConditions.push({
      OR: ["title", "description", "address", "city"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (city) {
    andConditions.push({
      city: {
        equals: city,
        mode: "insensitive",
      },
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (bedrooms) {
    andConditions.push({ bedrooms: Number(bedrooms) });
  }

  if (bathrooms) {
    andConditions.push({ bathrooms: Number(bathrooms) });
  }

  if (minRent || maxRent) {
    andConditions.push({
      rent: {
        ...(minRent && { gte: Number(minRent) }),
        ...(maxRent && { lte: Number(maxRent) }),
      },
    });
  }

  const whereConditions: Prisma.PropertyWhereInput = { AND: andConditions };

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: {
        [sortBy]: sortOrder === "asc" ? "asc" : "desc",
      },
      include: {
        category: true,
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.property.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: properties,
  };
};

const getSinglePropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          tenant: {
            select: { id: true, name: true, profileImage: true },
          },
        },
      },
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

const updateProperty = async (
  userId: string,
  propertyId: string,
  payload: IUpdatePropertyPayload,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== userId) {
    throw new Error("You are not authorized to update this property");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: payload as Prisma.PropertyUpdateInput,
  });
};

const deleteProperty = async (userId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== userId) {
    throw new Error("You are not authorized to delete this property");
  }

  return prisma.property.delete({
    where: { id: propertyId },
  });
};

export const propertyService = {
  createProperty,
  getAllProperties,
  getSinglePropertyById,
  updateProperty,
  deleteProperty,
};
