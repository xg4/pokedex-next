import type { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'
import '../styles/tailwind.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '宝可梦',
  description: 'A simple pokédex made with React & Next.js & PokéAPI & Tailwindcss',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-cn">
      <body className="bg-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
