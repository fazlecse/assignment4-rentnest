import { z } from "zod";

export const registerValidation = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["TENANT", "LANDLORD"]),
  }),
});
