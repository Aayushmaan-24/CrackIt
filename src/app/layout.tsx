import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PostHogProvider } from '@/components/providers/PostHogProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

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
      className={`h-full antialiased dark`}
    >
      <body className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans bg-[#0a0a0a] text-white min-h-screen flex flex-col`}>
        <PostHogProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
