import Navbar from "@/components/custom/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Alfred",
  description: "Personal Assistant for everyone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
        
        <Toaster />
        </body>
    </html>
  );
}
