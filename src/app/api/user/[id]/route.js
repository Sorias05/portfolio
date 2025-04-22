import { withAuthorization } from "@/app/lib/guards/withAuthorization";
import { deleteUser, getUserById, updateUser } from "../service";

export async function GET(req) {
  const id = new URL(req.url).pathname.split("/").pop();

  const auth = await withAuthorization(req, id);
  if (auth) return auth;

  return getUserById(id);
}

export async function PUT(req) {
  const id = new URL(req.url).pathname.split("/").pop();

  const auth = await withAuthorization(req, id);
  if (auth) return auth;

  return updateUser(id, req);
}

export async function DELETE(req) {
  const id = new URL(req.url).pathname.split("/").pop();

  const auth = await withAuthorization(req, id);
  if (auth) return auth;

  return deleteUser(id);
}
