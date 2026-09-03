import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Ticket",
  description: "Aplikasi Event Ticket Terpusat",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Event Ticket",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import Script from "next/script";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { BottomNavigation } from "@/components/bottom-navigation";

import { auth } from "@/lib/auth/server";

import { prisma } from "@/lib/prisma";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.getSession();

  if (session?.user?.email) {
    const existingUser = await prisma.pengguna.findUnique({
      where: { email: session.user.email },
    });
    
    if (!existingUser) {
      await prisma.pengguna.create({
        data: {
          email: session.user.email,
          nama: session.user.name || "Pengguna",
          peran: "pengguna",
        },
      });
    }
  }

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", outfit.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "15rem",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar initialSession={session} />
          <SidebarInset>
            <div className="flex flex-1 flex-col pb-16 md:pb-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
        <BottomNavigation />
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
