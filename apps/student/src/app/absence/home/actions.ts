'use server'

import { HomecomingFormValues } from './page'
import { postHomecomingSubmission } from '@/firestore/submission-operations'
import { HomecomingSubmission, Location, SystemConfig } from '@yurigaoka-app/common'
import { fetchLocationsByUser } from '@/firestore/location-operations'
import { combineDateAndTime } from '@/utils/dateUtils'
import { getSystemConfig } from '@/firestore/system-config-operations'
import { validateSubmissionAcceptanceTime } from '@/utils/submissionValidation'

// uidからlocationsを取得
export async function getLocations(uid: string): Promise<Location[]> {
  return await fetchLocationsByUser(uid)
}

// システム設定を取得
export async function getSystemConfigAction(): Promise<SystemConfig> {
  return await getSystemConfig()
}

// 帰省届を提出
export async function submitHomecomingForm(data: HomecomingFormValues, uid: string) {
  // 申請受付時間のバリデーション
  const systemConfig = await getSystemConfig()
  validateSubmissionAcceptanceTime(systemConfig.submissionAcceptanceHours)

  // 日付と時刻を組み合わせて完全なDateオブジェクトを作成
  const startDateTime = combineDateAndTime(data.startDate, data.departureTime)
  const endDateTime = combineDateAndTime(data.endDate, data.returnTime)

  // 受け取ったdataをHomecomingSubmission型に変換
  const parsedData: Omit<HomecomingSubmission, 'id'> = {
    userId: uid,
    type: '帰省',
    status: 'pending',
    reason: data.reason || '',
    specialReason: data.specialReason,
    locationId: data.locationId,
    startDate: startDateTime,
    endDate: endDateTime,
    createdAt: new Date(),
    mealsOff: generateMealsOffArray(data.startDate, data.endDate, data.meal_start, data.meal_end),
  }
  await postHomecomingSubmission(parsedData)

  // メール通知を送信
  try {
    const { sendNotificationEmail } = await import('@/utils/email')
    await sendNotificationEmail(uid, '帰省', {
      startDate: startDateTime,
      endDate: endDateTime,
      reason: data.reason || '',
      specialReason: data.specialReason,
      mealsOff: parsedData.mealsOff,
    })
  } catch (error) {
    // メール送信エラーはログに記録するが、届け出の提出は成功とする
    console.error('メール通知の送信に失敗しました:', error)
  }
}

// 期間中の欠食配列を生成する関数
function generateMealsOffArray(
  startDate: string,
  endDate: string,
  mealStart: 'breakfast' | 'dinner' | null,
  mealEnd: 'breakfast' | 'dinner' | null
): Array<{ date: Date; breakfast: boolean; dinner: boolean }> {
  const mealsOff: Array<{ date: Date; breakfast: boolean; dinner: boolean }> = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  // 開始日と終了日が同じ場合（1日欠食）
  if (startDate === endDate) {
    if (mealStart && mealEnd) {
      mealsOff.push({
        date: start,
        breakfast: mealStart === 'breakfast',
        dinner: mealEnd === 'dinner',
      })
    }
    return mealsOff
  }

  // 複数日の場合：開始日と終了日のみ
  // 開始日の食事設定
  if (mealStart) {
    mealsOff.push({
      date: start,
      breakfast: mealStart === 'breakfast',
      dinner: mealStart === 'dinner',
    })
  }

  // 終了日の食事設定
  if (mealEnd) {
    mealsOff.push({
      date: end,
      breakfast: mealEnd === 'breakfast',
      dinner: mealEnd === 'dinner',
    })
  }

  return mealsOff
}
