import { getTokenUser } from "@/app/lib/auth/getTokenUser";

export async function withAuthOnly(req) {
  const user = await getTokenUser(req);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}
