import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import '@heroui/react/styles'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'AI chat interface with human-in-the-loop tool approval',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#212121] text-[#ececec]">{children}</body>
    </html>
  )
}
