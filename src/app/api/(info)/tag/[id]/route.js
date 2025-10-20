import { deleteTag, getTagById, updateTag } from "../service";
import { AdminOnly } from "@/app/lib/guards/adminOnly";

export async function GET(req) {
  const id = new URL(req.url).pathname.split("/").pop();
  return getTagById(id);
}

export async function PUT(req) {
  const id = new URL(req.url).pathname.split("/").pop();

  const authCheck = await AdminOnly(req);
  if (authCheck) return authCheck;

  return updateTag(id, req);
}

export async function DELETE(req) {
  const id = new URL(req.url).pathname.split("/").pop();

  const authCheck = await AdminOnly(req);
  if (authCheck) return authCheck;

  return deleteTag(id);
}
