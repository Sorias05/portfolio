"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import ErrorPage from "next/error";
import { FadeProvider, useFade } from "@/context/FadeContext";
import { WindowManagerProvider } from "@/context/WindowContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import System from "@/sections/System";
import Toast from "@/components/Toast";

const RoutesContent = ({ children }) => {
  const { data: session, status } = useSession();
  const [show404, setShow404] = useState(false);
  const { isFading, isInSystem } = useFade();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setShow404(false);
    if (status === "loading") return;
    if (!session) return;

    const completePage = "/auth/complete";
    const isAuthPage = pathname.startsWith("/auth");
    const isCompletePage = pathname === completePage;

    if (session?.user?.isCompleted) {
      if (isCompletePage) {
        router.replace("/");
        setShow404(false);
      } else if (isAuthPage) {
        setShow404(true);
      }
    } else if (!session?.user?.isCompleted && !isCompletePage) {
      router.replace(completePage);
    }
  }, [session, status, pathname, router]);

  return (
    <>
      <div
        className={`absolute inset-0 z-[999] black transition-opacity duration-1000 pointer-events-none ${
          isFading ? "opacity-100" : "opacity-0"
        }`}
      />
      {isInSystem ? (
        <WindowManagerProvider>
          <System />
        </WindowManagerProvider>
      ) : (
        <>
          <Navbar />
          {show404 ? (
            <main className="main">
              <ErrorPage statusCode={404} />
            </main>
          ) : (
            <main className="main">{children}</main>
          )}
          <Footer />
        </>
      )}
    </>
  );
};

const Routes = ({ children }) => {
  return (
    <FadeProvider>
      <Toast />
      <RoutesContent>{children}</RoutesContent>
    </FadeProvider>
  );
};

export default Routes;
