'use server'

import { MealFormValues } from './page'

// TODO 欠食届のみを出す時の処理
export async function submitMealForm(data: MealFormValues) {
  console.log('サーバーアクションで受け取ったデータ:', data)
  // TODO: Firebaseに移行
  throw new Error('Firebase移行中のため、この機能は一時的に利用できません')
}
