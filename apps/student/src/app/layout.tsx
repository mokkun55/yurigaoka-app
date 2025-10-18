import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import dayjs from 'dayjs'

dayjs.locale('ja')

export const metadata: Metadata = {
  title: '百合が丘サポート',
  description: '百合が丘寮用のwebアプリ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`antialiased flex justify-center`}>
        <div className="w-[100svw] h-[100svh] max-w-[500px] max-h-[100vh] relative border-r border-l border-(--border-gray) flex flex-col">
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  )
}
