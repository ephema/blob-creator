"use client";
import { Inter as FontSans } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { BackgroundGradients } from "@/components/BackgroundGradients";

import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Delightful Blobs</title>
      </head>
      <body
        className={cn(
          "dark:dark min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <section className="dark relative overflow-hidden">
            <BackgroundGradients />
            <div className="mx-auto min-h-screen p-8 md:max-w-3xl">
              {children}
            </div>
          </section>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
