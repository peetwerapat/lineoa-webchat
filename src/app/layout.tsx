import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { QueryProvider } from "@/providers/QueryProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LINE OA Webchat",
  description: "Webchat console for a LINE Official Account",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
