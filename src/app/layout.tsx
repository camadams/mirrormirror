"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import DisneyMusicPlayer from "@/components/DisneyMusicPlayer";
import { AudioProvider } from "@/contexts/AudioContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <ReactQueryClientProvider>
          <AudioProvider audioSrc="/somedaymyprince.mp3">
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full h-full">
                <SidebarTrigger />
                <DisneyMusicPlayer />
                {children}
              </main>
            </SidebarProvider>
          </AudioProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
