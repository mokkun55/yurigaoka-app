import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

function getSessionCookieName(): string {
  const cookieName = process.env.SESSION_COOKIE_NAME
  if (!cookieName) {
    throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
  }
  return cookieName
}

function getMaxAge(): number {
  const maxAgeDaysStr = process.env.SESSION_COOKIE_MAX_AGE_DAYS
  if (!maxAgeDaysStr) {
    throw new Error('環境変数 SESSION_COOKIE_MAX_AGE_DAYS が設定されていません')
  }

  const maxAgeDays = parseInt(maxAgeDaysStr, 10)
  if (isNaN(maxAgeDays) || maxAgeDays <= 0) {
    throw new Error('環境変数 SESSION_COOKIE_MAX_AGE_DAYS は正の整数である必要があります')
  }

  return 60 * 60 * 24 * maxAgeDays * 1000
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 400 })
    }

    // 環境変数を取得
    const cookieName = getSessionCookieName()
    const maxAge = getMaxAge()

    // 1. Firebase Admin SDKでセッションCookieを作成
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: maxAge,
    })

    // 2. セッションCookieを検証してUIDを取得
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    const uid = decodedClaims.uid

    if (!uid) {
      return NextResponse.json({ error: 'UID not found' }, { status: 400 })
    }

    // 3. Firestoreからユーザー情報を取得
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const isRegistered = userDoc.exists ? (userDoc.data()?.isRegistered ?? false) : false

    // 4. CookieをHttpOnlyでセキュアに設定
    ;(await cookies()).set({
      name: cookieName,
      value: sessionCookie,
      maxAge: maxAge / 1000, // maxAgeは秒単位
      httpOnly: true, // JavaScriptからのアクセスを禁止
      secure: process.env.NODE_ENV === 'production', // HTTPSでのみ送信
      path: '/',
      sameSite: 'lax',
    })

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      isRegistered,
    })
  } catch (error) {
    console.error('Session Login Error:', error)
    return NextResponse.json({ error: 'Failed to create session cookie' }, { status: 401 })
  }
}
