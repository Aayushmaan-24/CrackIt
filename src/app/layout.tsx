import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets : ['latin'] })

export const metadata: Metadata = {
  title: "CrackIt — Crack every round. Land every offer.",
  description:"The ultimate placement prep guide for college students. 200+ DSA questions, system design, core CS — all in one place.",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
