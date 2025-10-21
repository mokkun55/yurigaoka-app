'use client'

import type { User } from 'firebase/auth'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase/client'
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext<{
  currentUser: User | null | undefined
  uid: string | null
  claims: { role: string; isRegistered: boolean; uid: string } | null
}>({
  currentUser: undefined,
  uid: null,
  claims: null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
  const [uid, setUid] = useState<string | null>(null)
  const [claims, setClaims] = useState<{ role: string; isRegistered: boolean; uid: string } | null>(null)
  const getRoles = async () => {
    const roles = await fetch('/api/auth/verify-token')
    if (!roles.ok) {
      throw new Error('Failed to fetch roles')
    }
    const data = await roles.json()
    return {
      role: data.role,
      isRegistered: data.isRegistered,
      uid: data.uid,
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        setUid(user.uid)
        getRoles().then((roles) => {
          setClaims(roles)
        })
      } else {
        setCurrentUser(null)
        setUid(null)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        uid,
        claims,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useFirebaseAuthContext = () => useContext(AuthContext)
