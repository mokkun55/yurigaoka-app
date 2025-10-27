'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    // ログアウト処理を実行
    const logout = async () => {
      try {
        const response = await fetch('/api/auth/session-logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          // ログインページにリダイレクト
          router.push('/login')
        } else {
          console.error('ログアウトに失敗しました')
          router.push('/login')
        }
      } catch (error) {
        console.error('ログアウトエラー:', error)
        router.push('/login')
      }
    }

    logout()
  }, [router])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666',
      }}
    >
      ログアウト中...
    </div>
  )
}
