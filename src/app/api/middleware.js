import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    async authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;

      if (!token) return pathname.startsWith("/auth/login");

      if (!token.user?.isCompleted) {
        return pathname.startsWith("/auth/complete");
      }

      if (pathname.startsWith("/auth/")) return false;

      return true;
    },
  },
});
