import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

// Cookieの有効期限
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME
if (!SESSION_COOKIE_NAME) {
  throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
}
const cookieName: string = SESSION_COOKIE_NAME

const SESSION_COOKIE_MAX_AGE_DAYS = process.env.SESSION_COOKIE_MAX_AGE_DAYS
if (!SESSION_COOKIE_MAX_AGE_DAYS) {
  throw new Error('環境変数 SESSION_COOKIE_MAX_AGE_DAYS が設定されていません')
}

const MAX_AGE_DAYS = parseInt(SESSION_COOKIE_MAX_AGE_DAYS, 10)
if (isNaN(MAX_AGE_DAYS) || MAX_AGE_DAYS <= 0) {
  throw new Error('環境変数 SESSION_COOKIE_MAX_AGE_DAYS は正の整数である必要があります')
}

const MAX_AGE = 60 * 60 * 24 * MAX_AGE_DAYS * 1000

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
      maxAge: MAX_AGE / 1000, // maxAgeは秒単位
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
