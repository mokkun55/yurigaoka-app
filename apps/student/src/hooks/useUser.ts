import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import type { UserInfo } from '@yurigaoka-app/common'

export function useUser() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true)
      setError(null)

      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        // Firestoreからユーザー情報を取得
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const data = userDoc.data() as UserInfo
          setUser(data)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, loading, error }
}
