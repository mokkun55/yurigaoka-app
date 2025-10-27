'use client'

import BaseButton from '@/ui/base-button'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'

export default function SettingPage() {
  const { getUser, signOut } = useAuth()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      setUser(user)
    }
    fetchUser()
  }, [getUser])

  return (
    <div>
      <h1>ログイン中のユーザー</h1>
      <p>{user?.email}</p>
      <p>{user?.displayName}</p>
      <BaseButton onClick={() => signOut()}>ログアウト</BaseButton>

      <div style={{ marginTop: '2rem' }}>
        <h2>開発者向け</h2>
        <BaseButton onClick={() => (window.location.href = '/debug')}>検証ページを開く</BaseButton>
      </div>
    </div>
  )
}
