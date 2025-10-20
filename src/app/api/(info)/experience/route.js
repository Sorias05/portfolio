import { getExperiences, createExperience } from "./service";
import { AdminOnly } from "@/app/lib/guards/adminOnly";

export async function POST(req) {
  const auth = await AdminOnly(req);
  if (auth) return auth;

  return createExperience(req);
}

export async function GET() {
  return getExperiences();
}
