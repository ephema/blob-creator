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

const mainUrl = "https://blobs.ephema.io";
const isDevelopment = process.env.NODE_ENV === "development";
const isProductionDeploy = process.env.CONTEXT === "production";
const deploymentUrl = isProductionDeploy
  ? mainUrl
  : process.env.DEPLOY_PRIME_URL || mainUrl;

const metadataBase = isDevelopment
  ? new URL(`http://localhost:${process.env.PORT || 3000}`)
  : new URL(deploymentUrl);

export const metadata = {
  title: "Ethereum Blob Creator | ephema",
  description:
    "Create and submit EIP-4844 blobs to Ethereum directly from your browser",
  metadataBase: metadataBase,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "ephema",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
