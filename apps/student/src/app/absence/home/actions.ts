'use server'

import { HomecomingFormValues } from './page'
// import dayjs from 'dayjs'

// TODO 帰省&欠食届を出す時の処理
export async function submitHomecomingForm(data: HomecomingFormValues) {
  console.log('サーバーアクションで受け取ったデータ:', data)
  // TODO: Firebaseに移行
  throw new Error('Firebase移行中のため、この機能は一時的に利用できません')
}
