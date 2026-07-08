import { Prisma } from "../../../generated/prisma/client";
import { PropertyStatus, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateRentalRequestPayload,
  IRentalRequestQuery,
} from "./rental.interface";

const createRentalRequest = async (
  tenantId: string,
  payload: ICreateRentalRequestPayload,
) => {
  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.status !== PropertyStatus.AVAILABLE) {
    throw new Error("This property is not available for rent");
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: { in: [RentalStatus.PENDING, RentalStatus.APPROVED] },
    },
  });

  if (existingRequest) {
    throw new Error(
      "You already have an active rental request for this property",
    );
  }

  return prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      startDate: new Date(payload.startDate),
      months: payload.months,
    },
  });
};

const getMyRentalRequests = async (
  tenantId: string,
  query: IRentalRequestQuery,
) => {
  const { status, page = "1", limit = "10" } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const whereConditions: Prisma.RentalRequestWhereInput = {
    tenantId,
    ...(status && { status: status as RentalStatus }),
  };

  const [requests, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          include: { category: true },
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

const getSingleRentalRequest = async (
  userId: string,
  role: string,
  rentalRequestId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: {
      property: true,
      tenant: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  const isTenant = rentalRequest.tenantId === userId;
  const isLandlord = rentalRequest.property.landlordId === userId;

  if (!isTenant && !isLandlord && role !== "ADMIN") {
    throw new Error("You are not authorized to view this rental request");
  }

  return rentalRequest;
};

const getLandlordRentalRequests = async (
  landlordId: string,
  query: IRentalRequestQuery,
) => {
  const { status, page = "1", limit = "10" } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const whereConditions: Prisma.RentalRequestWhereInput = {
    property: { landlordId },
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

const updateRentalRequestStatus = async (
  landlordId: string,
  rentalRequestId: string,
  status: RentalStatus,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this rental request");
  }

  const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
    [RentalStatus.PENDING]: [RentalStatus.APPROVED, RentalStatus.REJECTED],
    [RentalStatus.APPROVED]: [RentalStatus.COMPLETED],
    [RentalStatus.REJECTED]: [],
    [RentalStatus.COMPLETED]: [],
  };

  if (!allowedTransitions[rentalRequest.status].includes(status)) {
    throw new Error(
      `Cannot change rental request status from ${rentalRequest.status} to ${status}`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status },
    });

    if (status === RentalStatus.APPROVED) {
      await tx.property.update({
        where: { id: rentalRequest.propertyId },
        data: { status: PropertyStatus.RENTED },
      });
    }

    if (status === RentalStatus.COMPLETED) {
      await tx.property.update({
        where: { id: rentalRequest.propertyId },
        data: { status: PropertyStatus.AVAILABLE },
      });
    }

    return updatedRequest;
  });
};

export const rentalService = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
};
