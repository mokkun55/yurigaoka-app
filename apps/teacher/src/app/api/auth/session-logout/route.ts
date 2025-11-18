import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME
if (!SESSION_COOKIE_NAME) {
  throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
}
const cookieName: string = SESSION_COOKIE_NAME

export async function POST() {
  try {
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
