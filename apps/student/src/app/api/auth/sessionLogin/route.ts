import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

// Cookieの有効期限（例: 5日間）
const MAX_AGE = 60 * 60 * 24 * 5 * 1000
const SESSION_COOKIE_NAME = '__session'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 400 })
    }

    // 1. Firebase Admin SDKでセッションCookieを作成
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: MAX_AGE,
    })

    // 2. CookieをHttpOnlyでセキュアに設定
    ;(await cookies()).set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: MAX_AGE / 1000, // maxAgeは秒単位
      httpOnly: true, // JavaScriptからのアクセスを禁止
      // secure: process.env.NODE_ENV === "production", // HTTPSでのみ送信
      path: '/',
      sameSite: 'lax',
    })

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
    })
  } catch (error) {
    console.error('Session Login Error:', error)
    return NextResponse.json({ error: 'Failed to create session cookie' }, { status: 401 })
  }
}
