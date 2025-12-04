'use server'

import { adminDb } from '@/lib/firebase/admin'
import type { UserFormValues, InvitationCodeValues } from './page'
import { createLocation } from '@/firestore/location-operations'
import { fetchInviteCodeByCode, incrementInviteCodeUsage } from '@/firestore/invite-code-operations'
import { SystemConfig } from '@yurigaoka-app/common'
import { getSystemConfig } from '@/firestore/system-config-operations'

// TODO ユーザー作成時の処理
export async function registerUser(
  registerFormData: UserFormValues & { name: string; uid: string; email: string; invitationCode?: string }
) {
  const updateData = {
    grade: registerFormData.gradeName,
    class: registerFormData.className,
    club: registerFormData.club === 'none' ? '' : registerFormData.club,
    roomNumber: registerFormData.roomNumber,
    phoneNumber: registerFormData.emergencyTel,
    parentName: registerFormData.parentName,
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

  // 招待コードが提供されている場合、使用回数を更新
  if (registerFormData.invitationCode) {
    try {
      const inviteCode = await fetchInviteCodeByCode(registerFormData.invitationCode)
      if (inviteCode) {
        await incrementInviteCodeUsage(inviteCode.id)
      }
    } catch (error) {
      // 招待コードの更新に失敗しても、ユーザー登録は続行
      console.error('招待コードの使用回数更新に失敗しました:', error)
    }
  }
}

// システム設定を取得
export async function getSystemConfigAction(): Promise<SystemConfig> {
  return await getSystemConfig()
}

export async function verifyInvitationCode(inviteFormData: InvitationCodeValues) {
  console.log('サーバーで受け取った招待コード:', inviteFormData)
  try {
    // 招待コードを取得
    const inviteCode = await fetchInviteCodeByCode(inviteFormData.invitationCode)

    if (!inviteCode) {
      throw new Error('招待コードが無効です')
    }

    // 有効期限のチェック
    const now = new Date()
    if (inviteCode.limitDate <= now) {
      throw new Error('招待コードの有効期限が切れています')
    }

    // 検証成功
    return { success: true, codeId: inviteCode.id }
  } catch (error) {
    console.error('招待コードの検証に失敗しました', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('招待コードの検証に失敗しました')
  }
}
