import type { Metadata } from 'next'
import { Crimson_Text, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const crimsonText = Crimson_Text({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson"
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: 'KATANA REQUIEM | Cut Through Fate',
  description: 'Cut Through Fate. Rule the Board. Become Legend. Join the Katana Requiem Chess Club.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${crimsonText.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
