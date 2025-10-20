import { deleteProject, getProjectById, updateProject } from "../service";
import { AdminOnly } from "@/app/lib/guards/adminOnly";

export async function GET(req) {
  const id = new URL(req.url).pathname.split("/").pop();
  return getProjectById(id);
}

export async function PUT(req) {
  const id = new URL(req.url).pathname.split("/").pop();

  const authCheck = await AdminOnly(req);
  if (authCheck) return authCheck;

  return updateProject(id, req);
}

export async function DELETE(req) {
  const id = new URL(req.url).pathname.split("/").pop();

  const authCheck = await AdminOnly(req);
  if (authCheck) return authCheck;

  return deleteProject(id);
}
