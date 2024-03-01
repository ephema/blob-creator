"use client";
import { Inter as FontSans } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/components/ThemeProvider";
import { queryClient } from "@/data/queryClient";
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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="mx-auto h-screen min-h-screen p-8 md:max-w-4xl">
              {children}
            </div>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
