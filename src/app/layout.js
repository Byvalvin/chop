// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar'; // Import Navbar component
import Footer from "@/components/Footer";
import "./globals.css";
import { Suspense } from "react";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the app
export const metadata = {
  title: "CHOP",
  description: "A love letter to the food that raised me.",
  // themeColor: "#FF5733",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/icons/leaf-icon-192.png",
    apple: "/images/icons/leaf-icon-192.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00b894" />
        <link rel="apple-touch-icon" href="/images/icons/leaf-icon-192.png" />
      </head>
      <body className="min-h-screen">

        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}


/*

https://www.appicon.co/
*/