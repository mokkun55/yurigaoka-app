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

      // ロールを取得してリダイレクト先を決定
      const roleResponse = await fetch('/api/auth/verify-token')
      if (roleResponse.ok) {
        const roleData = await roleResponse.json()
        // 寮長の場合は帰省者一覧へリダイレクト
        if (roleData.role === 'manager') {
          router.push('/students/on-leave')
        } else {
          router.push('/home')
        }
      } else {
        // ロール取得に失敗した場合はホームへリダイレクト
        router.push('/home')
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

      // ロールを取得してリダイレクト先を決定
      const roleResponse = await fetch('/api/auth/verify-token')
      if (roleResponse.ok) {
        const roleData = await roleResponse.json()
        // 寮長の場合は帰省者一覧へリダイレクト
        if (roleData.role === 'manager') {
          router.push('/students/on-leave')
        } else {
          router.push('/home')
        }
      } else {
        // ロール取得に失敗した場合はホームへリダイレクト
        router.push('/home')
      }
    } catch (error) {
      console.error(error)
      return `ログインに失敗しました: ${error}`
    }
  }

  // TODO 後で消す
  const signInWithStaff = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, 'staff@ktc.ac.jp', 'staff')
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

      // ロールを取得してリダイレクト先を決定
      const roleResponse = await fetch('/api/auth/verify-token')
      if (roleResponse.ok) {
        const roleData = await roleResponse.json()
        // 寮長の場合は帰省者一覧へリダイレクト
        if (roleData.role === 'manager') {
          router.push('/students/on-leave')
        } else {
          router.push('/home')
        }
      } else {
        // ロール取得に失敗した場合はホームへリダイレクト
        router.push('/home')
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
    signInWithStaff,
    getUser,
  }
}
