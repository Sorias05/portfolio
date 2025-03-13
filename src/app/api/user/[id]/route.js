import { deleteUser, getUserById, updateUser } from "../service";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return getUserById(id);
}

export async function PUT(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return updateUser(id, req);
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return deleteUser(id);
}
