import { adminAuth } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'

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
  const role = decodedClaims.role || '未設定'
  const isRegistered = decodedClaims.isRegistered || false
  const uid = decodedClaims.uid || '未設定'
  return NextResponse.json({ role, isRegistered, uid }, { status: 200 })
}

// カスタムクレームを更新
export async function PUT(req: NextRequest) {
  const { role, isRegistered } = await req.json()
  const sessionCookie = (await cookies()).get('__session')?.value
  if (!sessionCookie) {
    return NextResponse.json({ error: 'セッションクッキーが見つかりません' }, { status: 400 })
  }
  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
  if (!decodedClaims) {
    return NextResponse.json({ error: 'セッションクッキーが無効です' }, { status: 400 })
  }

  // 現在のカスタムクレームを取得
  const currentRole = decodedClaims.role
  const currentIsRegistered = decodedClaims.isRegistered
  const currentUid = decodedClaims.uid

  // 新しいカスタムクレームを作成
  const newClaims = {
    role: role || currentRole,
    isRegistered: isRegistered ?? currentIsRegistered,
    uid: currentUid,
  }

  // 新しいカスタムクレームを設定
  await admin.auth().setCustomUserClaims(currentUid, newClaims)
  return NextResponse.json({ success: 'カスタムクレームを更新しました' }, { status: 200 })
}
