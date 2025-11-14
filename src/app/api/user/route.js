import { AdminOnly } from "@/app/lib/guards/adminOnly";
import { createUser, getUsers } from "./service";

export async function POST(req) {
  return createUser(req);
}

export async function GET(req) {
  const auth = await AdminOnly(req);
  if (auth) return auth;

  return getUsers();
}
