import { getProjects, createProject } from "./service";
import { AdminOnly } from "@/app/lib/guards/adminOnly";

export async function POST(req) {
  const auth = await AdminOnly(req);
  if (auth) return auth;

  return createProject(req);
}

export async function GET() {
  return getProjects();
}
