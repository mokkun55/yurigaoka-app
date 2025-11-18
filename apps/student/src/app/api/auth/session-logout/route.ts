import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

function getSessionCookieName(): string {
  const cookieName = process.env.SESSION_COOKIE_NAME
  if (!cookieName) {
    throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
  }
  return cookieName
}

export async function POST() {
  try {
    // 環境変数を取得（遅延評価）
    const cookieName = getSessionCookieName()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(cookieName)?.value

    // セッションCookieが存在する場合、Firebase側でも無効化
    if (sessionCookie) {
      try {
        // セッションCookieを検証してUIDを取得
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
        // ユーザーのリフレッシュトークンを無効化
        await adminAuth.revokeRefreshTokens(decodedClaims.uid)
      } catch (error) {
        // セッションCookieの検証に失敗しても、Cookieは削除する
        console.error('Session verification failed:', error)
      }
    }

    // セッションCookieを削除
    cookieStore.set({
      name: cookieName,
      value: '',
      maxAge: 0, // 即座に削除
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Session Logout Error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
