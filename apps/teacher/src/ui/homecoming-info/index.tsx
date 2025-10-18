import dayjs from '@/libs/dayjs'
import styles from './styles.module.css'
import { Home } from 'lucide-react'
import { getMealText } from '@/utils/getMealText'

type Props = {
  startDate: Date
  endDate: Date
  homeName: string
  address: string
  phoneNumber: string
  reason: string
  specialReason?: string
  meals?: {
    startMeal: boolean[]
    endMeal: boolean[]
  }
}

export default function HomecomingInfo({
  startDate,
  endDate,
  homeName,
  address,
  phoneNumber,
  reason,
  specialReason,
  meals,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Home size={32} color="var(--main-blue)" />
        <p className={styles.titleText}>帰省情報</p>
      </div>

      <div className={styles.content}>
        <div className={styles.labels}>
          <p>帰省期間</p>
          <p>欠食する食事</p>
          <p>帰省先</p>
          <p>住所</p>
          <p>連絡先</p>
          <p>帰省理由</p>
          {specialReason && <p>特別な事情</p>}
        </div>

        <div className={styles.values}>
          <p>
            {dayjs(startDate).format('YYYY/MM/DD(ddd) H:mm')} 〜 {dayjs(endDate).format('YYYY/MM/DD(ddd) H:mm')}
          </p>
          <p>
            {meals && (
              <>
                帰省日: {getMealText(meals.startMeal)} / 帰寮日: {getMealText(meals.endMeal)}
              </>
            )}
          </p>
          <p>{homeName}</p>
          <p>{address}</p>
          <p>{phoneNumber}</p>
          <p>{reason}</p>
          {specialReason && <p>{specialReason}</p>}
        </div>
      </div>
    </div>
  )
}
