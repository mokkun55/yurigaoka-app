import { useRouter } from 'next/navigation'
import { auth, googleProvider } from '@/lib/firebase/client'
import { signInWithPopup, signOut as firebaseSignOut, signInWithEmailAndPassword, type User } from 'firebase/auth'

export function useAuth() {
  const router = useRouter()

  const signOut = async () => {
    await firebaseSignOut(auth)
    const response = await fetch('/api/auth/session-logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('ログアウトに失敗しました')
    }
    router.push('/login')
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const token = await user.getIdToken(true)
      const response = await fetch('/api/auth/session-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
      if (!response.ok) {
        throw new Error('ログインに失敗しました')
      }

      // レスポンスから isRegistered を取得して適切なページにリダイレクト
      const data = await response.json()
      if (data.isRegistered) {
        router.push('/')
      } else {
        router.push('/create-user')
      }
    } catch (error) {
      console.error(error)
      return `ログインに失敗しました: ${error}`
    }
  }

  const getUser = async () => {
    const user = await auth.currentUser
    if (!user) {
      return null
    }
    return user as unknown as User
  }

  // TODO 後で消す
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user
      const token = await user.getIdToken(true)
      const response = await fetch('/api/auth/session-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
      if (!response.ok) {
        throw new Error('ログインに失敗しました')
      }

      // レスポンスから isRegistered を取得して適切なページにリダイレクト
      const data = await response.json()
      if (data.isRegistered) {
        router.push('/')
      } else {
        router.push('/create-user')
      }
    } catch (error) {
      console.error(error)
      return `ログインに失敗しました: ${error}`
    }
  }

  return {
    signOut,
    signInWithGoogle,
    signInWithEmail,
    getUser,
  }
}
