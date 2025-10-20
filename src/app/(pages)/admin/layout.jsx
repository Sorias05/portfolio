"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ErrorPage from "next/error";

const layout = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  if (session.data?.user?.isAdmin)
    return (
      <section className="my-24 admin-section">
        <h3 className="head-text">Admin</h3>
        <div className="admin-container">
          <div className="flex gap-2">
            <button
              className="btn w-full"
              onClick={() => router.push("/admin/projects")}
            >
              Projects
            </button>
            <button
              className="btn w-full"
              onClick={() => router.push("/admin/tags")}
            >
              Tags
            </button>
            <button
              className="btn w-full"
              onClick={() => router.push("/admin/experience")}
            >
              Experience
            </button>
          </div>
          {children}
        </div>
      </section>
    );

  return <ErrorPage statusCode={403} />;
};

export default layout;
