'use server'

import { adminDb, adminAuth } from '@/lib/firebase/admin'
import type { UserFormValues, InvitationCodeValues } from './page'
import { Timestamp } from 'firebase-admin/firestore'
import { cookies } from 'next/headers'
import { createLocation } from '@/firestore/location-operations'

// TODO ユーザー作成時の処理
export async function registerUser(registerFormData: UserFormValues & { name: string; uid: string; email: string }) {
  const updateData = {
    grade: registerFormData.gradeName,
    class: registerFormData.className,
    club: registerFormData.club === 'none' ? '' : registerFormData.club,
    roomNumber: registerFormData.roomNumber,
    phoneNumber: registerFormData.emergencyTel,
  }

  await adminDb.collection('users').doc(registerFormData.uid).update(updateData)

  // 新しい構造で住所情報を作成
  await createLocation({
    name: registerFormData.homeAddressName,
    address: registerFormData.homeAddressAddress,
    createdAt: new Date(),
    userId: registerFormData.uid,
  })

  // カスタムクレームを更新
  const sessionCookie = (await cookies()).get('__session')?.value
  if (!sessionCookie) {
    throw new Error('セッションクッキーが見つかりません')
  }

  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
  if (!decodedClaims) {
    throw new Error('セッションクッキーが無効です')
  }

  // 現在のカスタムクレームを取得して新しいクレームを設定
  await adminAuth.setCustomUserClaims(decodedClaims.uid, {
    role: decodedClaims.role || 'student',
    isRegistered: true,
    uid: decodedClaims.uid,
  })
}

export async function verifyInvitationCode(inviteFormData: InvitationCodeValues) {
  console.log('サーバーで受け取った招待コード:', inviteFormData)
  try {
    // 検証
    const snapshot = await adminDb.collection('inviteCodes').where('code', '==', inviteFormData.invitationCode).get()
    if (snapshot.empty) {
      throw new Error('招待コードが無効です')
    }
  } catch (error) {
    console.error('招待コードの検証に失敗しました', error)
    throw error
  }
}
