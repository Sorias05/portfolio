"use client";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Routes from "./routes";
import { developer } from "@/constants";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <title>{developer}</title>
        <script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"></script>
        <script
          src="https://files.bpcontent.cloud/2025/10/26/18/20251026185227-M64263SJ.js"
          defer
        ></script>
      </head>
      <body className="antialiased">
        <SessionProvider>
          <Routes>{children}</Routes>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
