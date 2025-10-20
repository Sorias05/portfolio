import { getTokenUser } from "@/app/lib/auth/getTokenUser";

export async function AdminOnly(req) {
  const user = await getTokenUser(req);
  if (!user || !user.isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}