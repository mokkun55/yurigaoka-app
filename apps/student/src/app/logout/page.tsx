'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  const { signOut } = useAuth()
  useEffect(() => {
    const logout = async () => {
      await signOut()
      redirect('/login')
    }
    logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
