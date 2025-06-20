import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIFFアンケートフォーム',
  description: '3択アンケートフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}