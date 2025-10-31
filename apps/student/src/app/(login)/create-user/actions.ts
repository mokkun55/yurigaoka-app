'use server'

import { adminDb } from '@/lib/firebase/admin'
import type { UserFormValues, InvitationCodeValues } from './page'
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

  // ユーザー情報とisRegisteredを更新
  await adminDb
    .collection('users')
    .doc(registerFormData.uid)
    .update({
      ...updateData,
      isRegistered: true,
    })

  // 新しい構造で住所情報を作成
  await createLocation({
    name: registerFormData.homeAddressName,
    address: registerFormData.homeAddressAddress,
    createdAt: new Date(),
    userId: registerFormData.uid,
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
