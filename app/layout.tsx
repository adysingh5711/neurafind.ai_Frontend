import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neurafind.ai',
  description: 'AI-powered product selection that helps users search and receive recommendations based on their needs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}
        <Analytics />
      </body>
    </html>
  )
}
