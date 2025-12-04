'use server'

import { MealFormValues } from './page'
import { postMealAbsenceSubmission } from '@/firestore/submission-operations'
import { MealAbsenceSubmission, SystemConfig } from '@yurigaoka-app/common'
import { getSystemConfig } from '@/firestore/system-config-operations'

// システム設定を取得
export async function getSystemConfigAction(): Promise<SystemConfig> {
  return await getSystemConfig()
}

// 欠食届を提出
export async function submitMealForm(data: MealFormValues, uid: string) {
  // 受け取ったdataをMealAbsenceSubmission型に変換
  const parsedData: Omit<MealAbsenceSubmission, 'id'> = {
    userId: uid,
    type: '欠食',
    status: 'pending',
    reason: data.reason || '',
    specialReason: '',
    createdAt: new Date(),
    mealsOff: generateMealsOffArray(data),
  }
  await postMealAbsenceSubmission(parsedData)
}

// 期間中の欠食配列を生成する関数
function generateMealsOffArray(data: MealFormValues): Array<{ date: Date; breakfast: boolean; dinner: boolean }> {
  const mealsOff: Array<{ date: Date; breakfast: boolean; dinner: boolean }> = []
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)

  // 開始日と終了日が同じ場合（1日欠食）
  if (data.startDate === data.endDate) {
    mealsOff.push({
      date: start,
      breakfast: data.oneDayBreakfast || false,
      dinner: data.oneDayDinner || false,
    })
    return mealsOff
  }

  // 複数日の場合：開始日と終了日のみ
  // 開始日の食事設定
  if (data.start_meal) {
    mealsOff.push({
      date: start,
      breakfast: data.start_meal === 'breakfast',
      dinner: data.start_meal === 'dinner',
    })
  }

  // 終了日の食事設定
  if (data.end_meal) {
    mealsOff.push({
      date: end,
      breakfast: data.end_meal === 'breakfast',
      dinner: data.end_meal === 'dinner',
    })
  }

  return mealsOff
}
