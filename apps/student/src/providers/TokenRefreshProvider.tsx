'use client'

import { useTokenRefresh } from '@/hooks/useTokenRefresh'

/**
 * トークン自動更新プロバイダー
 * アプリケーション全体でFirebase Authのトークンを監視し、自動的に更新する
 */
export function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
  useTokenRefresh()
  return <>{children}</>
}
