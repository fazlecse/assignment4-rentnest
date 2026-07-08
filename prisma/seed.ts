import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/enums";

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: {
      email: "admin@rentnest.com",
    },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        name: "System Admin",
        email: "admin@rentnest.com",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("✅ Admin created");
  } else {
    console.log("ℹ️ Admin already exists");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
