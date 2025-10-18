'use server'

import type { UserFormValues, InvitationCodeValues } from './page'

// TODO ユーザー作成時の処理
export async function registerUser(registerFormData: UserFormValues) {
  // TODO: Firebaseに移行
  throw new Error('Firebase移行中のため、この機能は一時的に利用できません')

  console.log('サーバーで受け取ったユーザー情報:', registerFormData)
  // TODO: Firebaseでの実装に置き換える
  // 学年 クラス 部活 帰省先 保護者氏名 住所 緊急連絡先 を登録する
}

export async function verifyInvitationCode(inviteFormData: InvitationCodeValues) {
  console.log('サーバーで受け取った招待コード:', inviteFormData)
  // TODO: Firebaseに移行: 招待コードを検証する
  throw new Error('Firebase移行中のため、この機能は一時的に利用できません')
}
