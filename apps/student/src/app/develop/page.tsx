'use client'

import { Button } from '@/_components/ui/button'
import LoadingSpinner from '@/_components/ui/loading-spinner'
import { useAuth } from '@/hooks/useAuth'
// TODO: Firebaseに移行後、User型を更新
type User = any
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function DevelopPage() {
  const { signOut, getUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      const userData = await getUser()
      setUser(userData)
      setLoading(false)
    }
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="m-3 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">開発用ページ</h1>

      {/* ログイン情報 */}
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <p>
            ログイン情報:
            <span className="font-bold">{user ? 'ログイン中' : 'ログインしていません'}</span>
          </p>
          <p>
            初回登録: {Cookies.get('is_registered') == 'true' ? '完了' : '未完了'}
            <span className="text-xs">({Cookies.get('is_registered')})</span>
          </p>
          {user && (
            <>
              <p>ユーザーID: {user.id}</p>
              <pre className="h-40 overflow-y-auto text-xs">{JSON.stringify(user, null, 2)}</pre>
              <Button fullWidth className="mt-2" variant="destructive" onClick={() => signOut()}>
                ログアウト
              </Button>
            </>
          )}
          <Button fullWidth className="mt-2" onClick={() => router.push('/develop/login')}>
            開発者ログインページへ
          </Button>
        </div>
      )}

      <Button
        fullWidth
        className="mt-2"
        variant="destructive"
        onClick={() => {
          Object.keys(Cookies.get()).forEach((cookieName) => {
            Cookies.remove(cookieName)
          })
          // ページをリロードして変更を反映
          router.refresh()
        }}
      >
        cookieリセット
      </Button>
    </div>
  )
}
