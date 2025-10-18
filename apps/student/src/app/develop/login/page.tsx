'use client'

import { Button } from '@/_components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signInWithStaff } = useAuth()

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await signInWithGoogle()
  }

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    await signInWithEmail(email, password || 'mokkun')
  }

  const handleStaffLogin = async () => {
    await signInWithStaff()
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">検証用ログインページ</h1>
      <Button onClick={handleGoogleLogin}>googleでログイン</Button>
      <Button onClick={handleStaffLogin}>スタッフログイン</Button>
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-2">
        <input type="email" name="email" placeholder="メールアドレス" />
        <input type="password" name="password" placeholder="パスワード 省略で mokkun" />
        <Button type="submit">メールアドレスでログイン</Button>
      </form>
    </div>
  )
}
