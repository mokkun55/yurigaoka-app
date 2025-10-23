'use server'

import { adminDb } from '@/lib/firebase/admin'
import { HomecomingFormValues } from './page'
// import dayjs from 'dayjs'

// uidからlocationsを取得
export async function getLocations(uid: string) {
  const userDoc = await adminDb.collection('users').doc(uid).get()

  if (!userDoc.exists) {
    throw new Error('ユーザーが見つかりません')
  }

  const userData = userDoc.data()
  return userData?.locations || []
}

// 帰省届を提出
export async function submitHomecomingForm(data: HomecomingFormValues) {
  console.log('サーバーアクションで受け取ったデータ:', data)
  // TODO: Firebaseに移行
  throw new Error('Firebase移行中のため、この機能は一時的に利用できません')
}
