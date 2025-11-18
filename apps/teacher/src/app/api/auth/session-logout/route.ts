import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

function getSessionCookieName(): string {
  const cookieName = process.env.SESSION_COOKIE_NAME
  if (!cookieName) {
    throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
  }
  return cookieName
}

export async function POST() {
  try {
    // 環境変数を取得
    const cookieName = getSessionCookieName()
    // セッションCookieを削除
    ;(await cookies()).set({
      name: cookieName,
      value: '',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    })
  } catch (error) {
    console.error('Session logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
