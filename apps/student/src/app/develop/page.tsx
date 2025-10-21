'use client'

import { Button } from '@/_components/ui/button'
import LoadingSpinner from '@/_components/ui/loading-spinner'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useFirebaseAuthContext } from '@/providers/AuthProvider'

export default function DevelopPage() {
  const { signOut } = useAuth()
  const router = useRouter()
  const { currentUser: user, claims } = useFirebaseAuthContext()

  return (
    <div className="m-3 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">開発用ページ</h1>

      {/* ログイン情報 */}
      {user === undefined ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : user === null ? (
        <div>
          <p>ログインしていません</p>
          <Button fullWidth className="mt-2" onClick={() => router.push('/develop/login')}>
            開発者ログインページへ
          </Button>
        </div>
      ) : (
        <div>
          <p>
            ログイン情報: <span className="font-bold">ログイン中</span>
          </p>
          <p>role: {claims?.role}</p>
          <p>isRegistered: {claims?.isRegistered ? 'true' : 'false'}</p>
          <p>ユーザーID: {user.uid}</p>
          <pre className="h-40 overflow-y-auto text-xs">{JSON.stringify(user, null, 2)}</pre>
          <Button fullWidth className="mt-2" variant="destructive" onClick={() => signOut()}>
            ログアウト
          </Button>
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
