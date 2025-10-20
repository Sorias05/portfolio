import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function getTokenUser(req) {
  const token = await getToken({ req, secret });

  if (!token) return null;

  return {
    id: token.id,
    email: token.email,
    name: token.name,
    isCompleted: token.user?.isCompleted,
    isAdmin: token.user?.isAdmin,
  };
}
