import styles from './styles.module.css'

type Props = {
  selectedDate: Date
}

export default function Status({ selectedDate }: Props) {
  // 今日の在寮人数と帰省者数
  // TODO 後で動的に取得する
  const studentCount = 100
  const onLeaveCount = 15
  const residentsCount = studentCount - onLeaveCount
  // TODO 後で削除
  console.log(selectedDate.toLocaleDateString())

  return (
    <div className={styles.container}>
      <div className={styles.residents}>
        <p className={styles.label}>在寮</p>
        <p className={styles.residentsCount}>{residentsCount}</p>
      </div>
      <div className={styles.border} />
      <div className={styles.onLeave}>
        <p className={styles.label}>帰省</p>
        <p className={styles.onLeaveCount}>{onLeaveCount}</p>
      </div>
    </div>
  )
}
