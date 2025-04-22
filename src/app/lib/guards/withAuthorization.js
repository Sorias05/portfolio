import { getTokenUser } from "../auth/getTokenUser";

export async function withAuthorization(req, resourceOwnerId) {
  const user = await getTokenUser(req);
  if (!user || user.id !== resourceOwnerId) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}
