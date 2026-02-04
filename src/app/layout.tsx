import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
      <head>
        {/* Kakao SDK - 카카오톡 공유 기능용 */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
          integrity="sha384-l+xbElFSnPZ2rOaPrU//2FF5B4LB8FiX5q4fXYTlfcG4PGpMkE1vcL7kNXI6Cci0"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
