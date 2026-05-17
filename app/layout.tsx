import React from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreelancePro | Comprehensive Freelancing Marketplace",
  description: "Connect with top freelancers and clients on our secure platform.",
};

import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { LocomotiveProvider } from "@/components/locomotive-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <LocomotiveProvider>
            <main className="min-h-screen bg-background">
              {children}
            </main>
          </LocomotiveProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
