import BaseButton from '@/ui/base-button'
import styles from './styles.module.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from '@/libs/dayjs'

type Props = {
  selectedDate: Date
  setSelectedDate: (_date: Date) => void
}

export default function DateSelect({ selectedDate, setSelectedDate }: Props) {
  const handlePreviousDate = () => {
    setSelectedDate(dayjs(selectedDate).add(-1, 'day').toDate())
  }
  const handleNextDate = () => {
    setSelectedDate(dayjs(selectedDate).add(1, 'day').toDate())
  }

  return (
    <div className={styles.container}>
      <BaseButton variant="icon" width="32px" height="32px" onClick={handlePreviousDate}>
        <ChevronLeft strokeWidth={4} size={32} color="var(--sub-text)" />
      </BaseButton>
      <p className={styles.date}>{dayjs(selectedDate).format('YYYY年M月D日(ddd)')}</p>
      <BaseButton variant="icon" width="32px" height="32px" onClick={handleNextDate}>
        <ChevronRight strokeWidth={4} size={32} color="var(--sub-text)" />
      </BaseButton>
    </div>
  )
}
