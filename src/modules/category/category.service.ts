import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string }) => {
  const result = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (result) {
    throw new Error("Category already exists");
  }

  const category = prisma.category.create({
    data: payload,
  });
  return category;
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
const getSingleCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

const updateCategory = async (
  categoryId: string,
  payload: { name?: string },
) => {
  await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });
  const result = prisma.category.update({
    where: {
      id: categoryId,
    },
    data: payload,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  await getSingleCategory(id);

  return prisma.category.delete({
    where: {
      id,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
