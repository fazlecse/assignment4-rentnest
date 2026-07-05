import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
import "dotenv/config";

const PORT = config.port;

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting the server: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
