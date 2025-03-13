"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Routes from "./routes";
import Toast from "@/components/Toast";
import { developer } from "@/constants";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <title>{developer}</title>
      </head>
      <body className="antialiased">
        {/* <Toast /> */}
        <SessionProvider>
          <Routes>{children}</Routes>
        </SessionProvider>
      </body>
    </html>
  );
}
