import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Caloria — Smart Calorie Tracker',
  description: 'Track your daily caloric intake, scan nutrition labels, and reach your health goals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" aria-hidden />
        {children}
        <Analytics />
      </body>
    </html>
  )
}