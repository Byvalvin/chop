// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar'; // Import Navbar component
import "./globals.css";

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
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Include the Navbar and main content */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
