'use client'

import BaseButton from '@/ui/base-button'
import { fetchStudents } from '../(base)/students/hooks/fetch-students'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function DebugPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const handleFetchStudents = async () => {
    const students = await fetchStudents()
    console.log(students)
  }

  return (
    <div>
      <h1>検証ページ</h1>
      <div>
        <h2>デバック用ログイン</h2>
        <input type="text" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
        <BaseButton onClick={() => handleLogin()}>ログイン</BaseButton>
      </div>
      <BaseButton onClick={() => handleFetchStudents()}>学生一覧を取得</BaseButton>
    </div>
  )
}
