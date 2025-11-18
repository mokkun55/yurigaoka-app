import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME
if (!SESSION_COOKIE_NAME) {
  throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
}
// 型を確定させる（上記のチェックにより、ここでは string 型であることが保証されている）
const cookieName: string = SESSION_COOKIE_NAME

export async function GET() {
  // セッションCookieから取得
  const sessionCookie = (await cookies()).get(cookieName)?.value

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
