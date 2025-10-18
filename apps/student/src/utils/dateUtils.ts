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
