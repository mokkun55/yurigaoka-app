import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = '__session'

export async function POST() {
  try {
    // セッションCookieを削除
    ;(await cookies()).set({
      name: SESSION_COOKIE_NAME,
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
