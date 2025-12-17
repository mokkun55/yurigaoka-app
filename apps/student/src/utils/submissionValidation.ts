import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import type { SubmissionAcceptanceHours } from '@yurigaoka-app/common'

dayjs.extend(weekday)

/**
 * 申請受付時間内かどうかをチェック
 * @param acceptanceHours 申請受付時間設定
 * @throws {Error} 申請受付時間外の場合
 */
export function validateSubmissionAcceptanceTime(acceptanceHours: SubmissionAcceptanceHours): void {
  const now = dayjs()
  const dayOfWeek = now.day() // 0=日曜日, 1=月曜日, ..., 6=土曜日

  // 平日（月〜金、1-5）かどうかをチェック
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    throw new Error('申請の提出は平日のみ可能です。')
  }

  // 現在時刻をHH:mm形式に変換
  const currentTime = now.format('HH:mm')

  // 時刻文字列を比較用の数値（分）に変換
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  const currentMinutes = timeToMinutes(currentTime)
  const startMinutes = timeToMinutes(acceptanceHours.start)
  const endMinutes = timeToMinutes(acceptanceHours.end)

  // 申請受付時間外かどうかをチェック（開始時刻と終了時刻を含む）
  if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
    throw new Error(`申請の提出は平日の${acceptanceHours.start}〜${acceptanceHours.end}のみ可能です。`)
  }
}
