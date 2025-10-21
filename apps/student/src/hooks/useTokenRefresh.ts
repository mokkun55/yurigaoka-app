'use client'

import { useEffect, useRef } from 'react'
import { auth } from '@/lib/firebase/client'
import { onIdTokenChanged } from 'firebase/auth'

/**
 * Firebase AuthのトークンをサーバーのセッションCookieと同期させるフック
 * - トークンが更新されるたびに、サーバーのセッションCookieも更新する
 * - トークンは通常1時間で期限切れになるため、この処理が必要
 */
export function useTokenRefresh() {
  const isInitialMount = useRef(true)
  const lastTokenRef = useRef<string | null>(null)

  useEffect(() => {
    // Firebaseのトークンが変更されたときに発火
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          // 初回マウント時はスキップ（既存のセッションを利用）
          if (isInitialMount.current) {
            isInitialMount.current = false
            // 初回は現在のトークンだけ記録
            const token = await user.getIdToken(false)
            lastTokenRef.current = token
            return
          }

          // キャッシュされたトークンを取得（強制更新しない）
          const token = await user.getIdToken(false)

          // トークンが変更されていない場合はスキップ
          if (token === lastTokenRef.current) {
            return
          }

          lastTokenRef.current = token

          // サーバーのセッションCookieを更新
          await fetch('/api/auth/refresh-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })
        } catch (error) {
          console.error('Failed to refresh session:', error)
        }
      }
    })

    // 定期的にトークンを更新（バックアップとして55分ごと）
    const interval = setInterval(
      async () => {
        const user = auth.currentUser
        if (user) {
          try {
            // トークンを強制的に更新
            const token = await user.getIdToken(true)

            // サーバーのセッションCookieを更新
            await fetch('/api/auth/refreshSession', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            })
          } catch (error) {
            console.error('Failed to refresh token periodically:', error)
          }
        }
      },
      55 * 60 * 1000
    ) // 55分ごと（1時間の期限より少し前）

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])
}
