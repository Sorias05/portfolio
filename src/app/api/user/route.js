import { getUsers, createUser } from "./service";

export async function POST(req) {
  return createUser(req);
}

export async function GET() {
  return getUsers();
}