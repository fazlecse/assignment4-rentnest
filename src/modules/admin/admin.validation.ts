import { z } from "zod";
import { UserStatus } from "../../../generated/prisma/enums";

const updateUserStatusValidation = z.object({
  body: z.object({
    status: z.enum({
      ACTIVE: UserStatus.ACTIVE,
      BLOCKED: UserStatus.BLOCKED,
    }),
  }),
});

export const adminValidation = {
  updateUserStatusValidation,
};
