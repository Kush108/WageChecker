import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"


const inter = Inter({
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wagechecker.ca'),
  title: "Were you underpaid? Free Ontario ESA Check — wagechecker.ca",
  description:
    "Ontario workers lose millions yearly to unpaid overtime, missed stat holiday pay, and illegal shift cancellations. Check your last pay period free in 2 minutes. Anonymous, no login required.",
  verification: {
    google: 'QTiN3pf-wBqNToECb7mb6lDDUDjTiEUJXuSyAr1Wyeg'
  },
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
  alternates: {
  canonical: 'https://wagechecker.ca',
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
        <Analytics />
      </body>
    </html>
  )
}

