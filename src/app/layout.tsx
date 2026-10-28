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
  title: {
    default: 'CrackIt — Crack every round. Land every offer.',
    template: '%s — CrackIt',
  },
  verification: {
    google: "W9OmOyzuNr3yxwUcDAPRcwmE4l5VrEMw_KTGBO-o5zk"
  },
  description: 'Free placement prep platform for college students. 225+ company-tagged DSA questions, System Design (HLD/LLD), Core CS, SQL, Aptitude, HR behavioral questions. Google, Amazon, Microsoft, Goldman Sachs, BNY Mellon and more.',
  keywords: [
    'placement preparation', 'DSA questions', 'leetcode company tagged',
    'system design interview', 'campus placement India', 'Goldman Sachs interview',
    'BNY Mellon interview', 'JP Morgan interview', 'Amazon SDE internship',
    'Google interview prep', 'aptitude questions placement', 'HR behavioral questions',
    'SQL interview questions', 'software engineering interview', 'free placement prep',
    'CrackIt', 'crackit placement'
  ],
  authors: [{ name: 'Aayushmaan Chakraborty', url: 'https://github.com/Aayushmaan-24' }],
  creator: 'Aayushmaan Chakraborty',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://crack-it-zeta.vercel.app',
    siteName: 'CrackIt',
    title: 'CrackIt — Crack every round. Land every offer.',
    description: 'Free placement prep platform. 225+ company-tagged DSA questions, System Design, Core CS, Aptitude, HR. No paywall.',
    images: [
      {
        url: 'https://crack-it-zeta.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CrackIt — Placement Prep Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrackIt — Crack every round. Land every offer.',
    description: 'Free placement prep platform. 225+ company-tagged DSA questions, System Design, Core CS, Aptitude, HR. No paywall.',
    images: ['https://crack-it-zeta.vercel.app/og-image.png'],
    creator: '@aayushmaanc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

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
