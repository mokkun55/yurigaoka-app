import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import dayjs from '@/libs/dayjs'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
dayjs.locale('ja')

export const metadata: Metadata = {
  title: '帰省届管理ツール',
  description: '百合が丘寮の帰省届管理ツール',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        <div>
          <MantineProvider>
            <Toaster />
            {children}
          </MantineProvider>
        </div>
      </body>
    </html>
  )
}
