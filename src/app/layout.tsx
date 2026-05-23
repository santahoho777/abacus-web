import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
})

export const metadata: Metadata = {
  title: {
    default: '珠心算學習平台 | Miss Abacus',
    template: '%s | 珠心算學習平台',
  },
  description: '為6-12歲兒童設計的珠心算線上課程，學習算盤操作與心算技巧。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSansTC.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  )
}
