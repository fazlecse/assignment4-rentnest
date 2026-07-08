import { Role } from "../../../generated/prisma/enums";

export interface RegisterAuthPayload {
  name: string;
  email: string;
  password: string;
  profileImage: string;
  role: Role;
}

export interface ILoginUser {
  email: string;
  password: string;
}
