import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME
if (!SESSION_COOKIE_NAME) {
  throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
}
const cookieName: string = SESSION_COOKIE_NAME

async function verifyToken() {
  try {
    const sessionCookie = (await cookies()).get(cookieName)?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found' }, { status: 401 })
    }

    // セッションCookieを検証
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)

    const uid = decodedClaims.uid
    if (!uid) {
      return NextResponse.json({ error: 'UID not found' }, { status: 401 })
    }

    // Firestoreからユーザー情報を取得
    const userDoc = await adminDb.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User document not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const role = userData?.role || 'teacher'
    const isRegistered = userData?.isRegistered ?? false

    return NextResponse.json({
      role,
      isRegistered,
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ error: 'Invalid session cookie' }, { status: 401 })
  }
}

export async function GET() {
  return verifyToken()
}

export async function POST() {
  return verifyToken()
}
