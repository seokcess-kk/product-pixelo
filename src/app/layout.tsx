import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PIXELO - 나만의 감성 공간',
  description: '매일 답하는 질문으로 완성되는 나만의 픽셀 공간',
  keywords: ['PIXELO', '픽셀', '감성', '질문', '일기', 'MZ'],
  authors: [{ name: 'PIXELO Team' }],
  openGraph: {
    title: 'PIXELO - 나만의 감성 공간',
    description: '매일 답하는 질문으로 완성되는 나만의 픽셀 공간',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
