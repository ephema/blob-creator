"use client";
import { Inter as FontSans } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

import { queryClient } from "@/data/queryClient";
import { cn } from "@/lib/utils";
import { config as wagmiConfig } from "@/lib/wagmiConfig";

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
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="mx-auto h-screen min-h-screen p-8 md:max-w-3xl">
                {children}
              </div>
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
