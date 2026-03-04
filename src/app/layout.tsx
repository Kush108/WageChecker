import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "Ontario Wage Checker — Did Your Employer Pay You Correctly?",
  description:
    "Free ESA violation checker for Ontario workers. Check overtime pay, stat holiday pay, and shift cancellation rights in 2 minutes. Anonymous, no login required.",
  keywords: [
    "Ontario ESA calculator",
    "overtime pay Ontario",
    "Employment Standards Act",
    "stat holiday pay",
    "unpaid wages Ontario",
    "wage theft checker Canada"
  ],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Were you paid correctly? Check free in 2 minutes.",
    description:
      "Ontario workers lose millions to ESA violations. Check your last pay period anonymously.",
    url: "https://wagechecker.ca",
    siteName: "Wage Checker",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: "website"
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Were you underpaid?',
    description: 'Free Ontario ESA violation checker. Anonymous. 2 minutes.',
    images: ['/og-image.png'],
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background text-primary antialiased">
        {children}
      </body>
    </html>
  )
}

