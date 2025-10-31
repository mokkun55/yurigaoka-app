import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  // セッションCookieから取得
  const sessionCookie = (await cookies()).get('__session')?.value

  // cookieが存在しない場合はエラー
  if (!sessionCookie) {
    return NextResponse.json({ error: 'セッションクッキーが見つかりません' }, { status: 400 })
  }

  // cookieを検証
  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
  if (!decodedClaims) {
    return NextResponse.json({ error: 'セッションクッキーが無効です' }, { status: 400 })
  }

  const uid = decodedClaims.uid
  if (!uid) {
    return NextResponse.json({ error: 'UIDが見つかりません' }, { status: 400 })
  }

  // Firestoreからユーザー情報を取得
  const userDoc = await adminDb.collection('users').doc(uid).get()
  if (!userDoc.exists) {
    return NextResponse.json({ error: 'ユーザードキュメントが見つかりません' }, { status: 404 })
  }

  const userData = userDoc.data()
  const role = userData?.role || '未設定'
  const isRegistered = userData?.isRegistered ?? false

  return NextResponse.json({ role, isRegistered, uid }, { status: 200 })
}
