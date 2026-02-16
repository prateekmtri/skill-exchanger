// app/layout.js (MODIFIED - No Navbar)

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SocketProvider } from "@/context/SocketContext";
import { Toaster } from 'react-hot-toast';
// Navbar ka import yahan se hata diya gaya hai

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = { title: "Skill Exchange", description: "Learn, Share, Grow." };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SocketProvider>
          <Toaster position="top-right" />
          
          {/* Navbar aur main tag yahan se hata diye gaye hain */}
          {children}

        </SocketProvider>
      </body>
    </html>
  );
}