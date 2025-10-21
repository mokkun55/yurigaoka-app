import { adminAuth } from '@/lib/firebase/admin'
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
  // カスタムクレームを取得
  const role = decodedClaims.role
  const isRegistered = decodedClaims.isRegistered
  return NextResponse.json({ role, isRegistered })
}
