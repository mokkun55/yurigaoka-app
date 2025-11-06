import Status from './_components/status'
import Report from './_components/report'
import styles from './styles.module.css'
import { getPendingSubmissions } from './actions'
import { convertSubmissionToReportItem } from '@/utils/submissionUtils'

const studentsCount = 100
const onLeaveCount = 10

export default async function Home() {
  // サーバーアクションで承認待ちの申請を取得
  const pendingSubmissions = await getPendingSubmissions()

  // Reportコンポーネントが期待する形式に変換
  const reportItems = pendingSubmissions.map(convertSubmissionToReportItem)

  return (
    <div className={styles.container}>
      {/* 寮の状態 */}
      <div className={styles.dormitoryStatus}>
        <div className={styles.title}>寮の状態 (本日)</div>
        <div className={styles.statusContainer}>
          {/* 在寮人数 */}
          <Status studentCount={studentsCount} onLeaveCount={onLeaveCount} type="在寮人数" />
          {/* 帰省者数 */}
          <Status studentCount={studentsCount} onLeaveCount={onLeaveCount} type="帰省者数" />
        </div>
      </div>

      {/* 承認待ちの申請 */}
      <div className={styles.reportItems}>
        <div className={styles.title}>
          承認待ちの申請 <span className={styles.count}>({reportItems.length}件)</span>
        </div>
        <div className={styles.reportList}>
          <Report items={reportItems} />
        </div>
      </div>
    </div>
  )
}
