import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import ja from 'dayjs/locale/ja'

const DATE_FORMAT = 'YYYY/MM/DD(ddd)'
dayjs.extend(weekday)
dayjs.locale(ja)

/**
 * YYYY/MM/DD(ddd) 形式で日付を表示する共通関数
 */
export function formatDateWithWeekday(dateStr: string): string {
  if (!dateStr) return ''
  return dayjs(dateStr).format(DATE_FORMAT)
}

/**
 * FirestoreのTimestampをDateに変換する共通関数
 */
export function convertFirestoreTimestampToDate(timestamp: FirebaseFirestore.Timestamp): Date {
  return timestamp.toDate()
}

/**
 * 日付文字列と時刻文字列を組み合わせて完全なDateオブジェクトを作成する関数
 * @param dateStr 日付文字列 (例: '2024-01-15')
 * @param timeStr 時刻文字列 (例: '14:30')
 * @returns 組み合わせたDateオブジェクト
 */
export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  const date = new Date(dateStr)
  const [hours, minutes] = timeStr.split(':').map(Number)
  date.setHours(hours, minutes, 0, 0)
  return date
}
