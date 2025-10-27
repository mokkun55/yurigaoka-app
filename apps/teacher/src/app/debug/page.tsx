'use client'

import BaseButton from '@/ui/base-button'
import { fetchStudents } from '../(base)/students/hooks/fetch-students'
import { useState } from 'react'

export default function DebugPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    throw new Error('Firebase移行中なので利用不可: SupabaseからFirebaseに移行中です')
  }

  const handleFetchStudents = async () => {
    try {
      const students = await fetchStudents()
      console.log(students)
    } catch (error: unknown) {
      console.error('Error:', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div>
      <h1>検証ページ</h1>
      <div>
        <h2>デバック用ログイン</h2>
        <p style={{ color: 'red' }}>Firebase移行中なので利用不可</p>
        <input type="text" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
        <BaseButton onClick={() => handleLogin()}>ログイン</BaseButton>
      </div>
      <BaseButton onClick={() => handleFetchStudents()}>学生一覧を取得</BaseButton>
    </div>
  )
}
