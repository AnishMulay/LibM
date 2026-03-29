import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LibM',
  description: 'your shared shelf',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
