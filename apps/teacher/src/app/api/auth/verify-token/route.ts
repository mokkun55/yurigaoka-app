import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

const SESSION_COOKIE_NAME = '__session'

async function verifyToken() {
  try {
    const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found' }, { status: 401 })
    }

    // セッションCookieを検証
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)

    return NextResponse.json({
      role: decodedClaims.role || 'teacher',
      isRegistered: decodedClaims.isRegistered || false,
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
