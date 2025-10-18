import dayjs from '@/libs/dayjs'
import styles from './styles.module.css'
import { Utensils } from 'lucide-react'
import { getMealText } from '@/utils/getMealText'

type Props = {
  startDate: Date
  endDate: Date
  meals: {
    startMeal: boolean[]
    endMeal: boolean[]
  }
  reason: string
}

export default function MealAbsenceInfo({ startDate, endDate, meals, reason }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Utensils size={32} color="var(--main-blue)" />
        <p className={styles.titleText}>欠食情報</p>
      </div>

      <div className={styles.content}>
        <div className={styles.labels}>
          <p>欠食期間</p>
          <p>欠食する食事</p>
          <p>欠食理由</p>
        </div>

        <div className={styles.values}>
          <p>
            {dayjs(startDate).format('YYYY/MM/DD(ddd)')} 〜 {dayjs(endDate).format('YYYY/MM/DD(ddd)')}
          </p>
          <p>
            開始日: {getMealText(meals.startMeal)} / 終了日: {getMealText(meals.endMeal)}
          </p>
          <p>{reason}</p>
        </div>
      </div>
    </div>
  )
}
