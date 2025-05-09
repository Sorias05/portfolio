"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Routes from "./routes";
import { developer } from "@/constants";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <title>{developer}</title>
      </head>
      <body className="antialiased">
        <SessionProvider>
          <Routes>{children}</Routes>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
