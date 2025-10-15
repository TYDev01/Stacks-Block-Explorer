import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stacks Account History",
  description: "View your Stacks account history and transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <div className="flex min-h-screen flex-col w-full">
          {/* Navbar is a client component, so wrap it in a client-safe boundary */}
          <Navbar />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
