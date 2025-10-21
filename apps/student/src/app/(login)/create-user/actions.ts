'use server'

import { adminDb } from '@/lib/firebase/admin'
import type { UserFormValues, InvitationCodeValues } from './page'

// TODO ユーザー作成時の処理
export async function registerUser(registerFormData: UserFormValues) {
  console.log('サーバーで受け取ったユーザー情報:', registerFormData)
  // TODO: Firebaseでの実装に置き換える
  // 学年 クラス 部活 帰省先 保護者氏名 住所 緊急連絡先 を登録する
}

export async function verifyInvitationCode(inviteFormData: InvitationCodeValues) {
  console.log('サーバーで受け取った招待コード:', inviteFormData)
  try {
    // 検証
    const snapshot = await adminDb.collection('inviteCodes').where('code', '==', inviteFormData.invitationCode).get()
    if (snapshot.empty) {
      throw new Error('招待コードが無効です')
    }
    const inviteCode = snapshot.docs[0].data()
    console.log('招待コード:', inviteCode)
  } catch (error) {
    console.error('招待コードの検証に失敗しました', error)
    throw error
  }
}
