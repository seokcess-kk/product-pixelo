import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '공간 공유하기 - PIXELO',
  description: '나만의 픽셀 공간을 친구들과 공유해보세요',
  openGraph: {
    title: '공간 공유하기 - PIXELO',
    description: '나만의 픽셀 공간을 친구들과 공유해보세요',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'PIXELO 공유 카드',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '공간 공유하기 - PIXELO',
    description: '나만의 픽셀 공간을 친구들과 공유해보세요',
    images: ['/api/og'],
  },
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
