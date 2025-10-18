'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/_components/ui/button'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const error = await signInWithGoogle()
    if (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-[300px] justify-center">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">百合が丘サポート</h1>
        <p className="text-(--sub-text)">ようこそ！</p>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={handleGoogleLogin}>Googleでログイン</Button>
        <p className="text-center">学校から配布されたGoogleアカウント(ktc.ac.jp)でログインしてください</p>
      </div>
    </div>
  )
}
