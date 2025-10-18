import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { auth, googleProvider } from '@/lib/firebase/client'
import { signInWithPopup, signOut as firebaseSignOut, signInWithEmailAndPassword } from 'firebase/auth'

export function useAuth() {
  const router = useRouter()

  const signOut = async () => {
    await firebaseSignOut(auth)
    // cookieを削除
    Cookies.remove('is_registered')
    router.push('/login')
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
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
    return user
  }

  // TODO 後で消す
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
      return `ログインに失敗しました: ${error}`
    }
    router.push('/')
  }

  return {
    signOut,
    signInWithGoogle,
    signInWithEmail,
    getUser,
  }
}
