import BaseButton from '@/ui/base-button'
import styles from './styles.module.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from '@/libs/dayjs'

type Props = {
  year: number
  month: number
  // eslint-disable-next-line no-unused-vars
  onYearMonthChange: (year: number, month: number) => void
}

export default function MonthSelect({ year, month, onYearMonthChange }: Props) {
  const handlePreviousMonth = () => {
    const newDate = dayjs(`${year}-${month}-01`).subtract(1, 'month')
    onYearMonthChange(newDate.year(), newDate.month() + 1)
  }

  const handleNextMonth = () => {
    const newDate = dayjs(`${year}-${month}-01`).add(1, 'month')
    onYearMonthChange(newDate.year(), newDate.month() + 1)
  }

  return (
    <div className={styles.container}>
      <BaseButton variant="icon" width="32px" height="32px" onClick={handlePreviousMonth}>
        <ChevronLeft strokeWidth={4} size={32} color="var(--sub-text)" />
      </BaseButton>
      <p className={styles.date}>
        {year}年{month}月
      </p>
      <BaseButton variant="icon" width="32px" height="32px" onClick={handleNextMonth}>
        <ChevronRight strokeWidth={4} size={32} color="var(--sub-text)" />
      </BaseButton>
    </div>
  )
}
