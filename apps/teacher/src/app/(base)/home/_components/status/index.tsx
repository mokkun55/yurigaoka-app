import { LampCeiling, Users } from 'lucide-react'
import styles from './styles.module.css'

type Props = {
  studentCount: number
  onLeaveCount: number
  type: '在寮人数' | '帰省者数'
}

export default function Status({ studentCount, onLeaveCount, type }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.status}>
        <p className={styles.type}>{type}</p>
        <div className={styles.count}>
          {type === '在寮人数' ? (
            <>
              <p className={styles.number1}>{studentCount - onLeaveCount}</p>
              <span className={styles.slash}>/</span>
              <p className={styles.number2}>
                {studentCount} <span className={styles.unit}>人</span>
              </p>
            </>
          ) : (
            <p className={styles.number3}>
              {onLeaveCount} <span className={styles.unit}>人</span>
            </p>
          )}
        </div>
      </div>
      <div
        className={styles.icon}
        style={{ backgroundColor: type === '在寮人数' ? 'var(--main-blue-10)' : 'var(--orange-10)' }}
      >
        {type === '在寮人数' ? (
          <Users color="var(--main-blue)" size={24} />
        ) : (
          <LampCeiling color="var(--orange)" size={24} />
        )}
      </div>
    </div>
  )
}
