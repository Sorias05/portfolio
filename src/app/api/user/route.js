import { createUser } from "./service";

export async function POST(req) {
  return createUser(req);
}
