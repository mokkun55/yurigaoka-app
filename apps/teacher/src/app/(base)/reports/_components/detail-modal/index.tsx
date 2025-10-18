import styles from './styles.module.css'
import { Report } from '../../_type/report'
import dayjs from '@/libs/dayjs'
import { Calendar, FileText } from 'lucide-react'
import Badge from '@/ui/badge'
import HomecomingInfo from '@/ui/homecoming-info'
import MealAbsenceInfo from '@/ui/meal-absence-info'
import BaseButton from '@/ui/base-button'
import BaseTextarea from '@/ui/base-textarea'
import { useState } from 'react'

type Props = {
  report: Report
  onClose: () => void
}

const reportTypeMap = {
  homecoming: '帰省・欠食届',
  meal: '欠食届のみ',
}

// TODO 後で動的に取得
const homecomingInfoMock = {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-02'),
  homeName: '実家',
  address: '大阪府大阪市大阪区1-1-1',
  phoneNumber: '090-1234-5678',
  reason: '家族の用事',
  specialReason: '祖母の体調不良のため',
  // 帰省の場合欠食もするのでここで管理
  meals: {
    startMeal: [false, false],
    endMeal: [false, false],
  },
}

const mealAbsenceInfoMock = {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-02'),
  meals: {
    startMeal: [false, false],
    endMeal: [false, false],
  },
  reason: '家族の用事',
}

export default function DetailModal({ report, onClose }: Props) {
  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <div className={styles.studentInfo}>
          <div className={styles.grade}>
            {report.grade}年 {report.class}組
          </div>
          <h1 className={styles.name}>{report.name}</h1>
        </div>

        {/* 申請info */}
        <div className={styles.applyInfo}>
          <div className={styles.labels}>
            <div className={styles.labelText}>
              <Calendar size={16} />
              申請日
            </div>
            <div className={styles.labelText}>
              <FileText size={16} />
              申請種別
            </div>
          </div>
          <div className={styles.values}>
            <div className={styles.date}>{dayjs(report.createdAt).format('YYYY年M月D日 (ddd)')}</div>
            <div className={styles.applyType}>{reportTypeMap[report.type]}</div>
          </div>
        </div>

        {/* ステータス */}
        <div className={styles.status}>
          <Badge variant={report.status} size="big" />
        </div>

        {/* 差し戻し理由 */}
        {report.status === 'rejected' && (
          <div className={styles.reject}>
            <p>却下理由: {report.rejectReason}</p>
          </div>
        )}

        {/* 帰省情報 */}
        {report.type === 'homecoming' && <HomecomingInfo {...homecomingInfoMock} />}

        {/* 欠食情報 */}
        {report.type === 'meal' && <MealAbsenceInfo {...mealAbsenceInfoMock} />}

        {/* 承認UI (申請中の場合) */}
        {report.status === 'pending' && (
          <>
            <ApprovedUI />
          </>
        )}

        <div className={styles.buttonContainer}>
          <BaseButton onClick={onClose} variant="secondary">
            閉じる
          </BaseButton>
        </div>
      </div>
    </div>
  )
}

// 承認UI
const ApprovedUI = () => {
  const [comment, setComment] = useState('')
  const handleReject = () => {
    console.log('差し戻す')
  }
  const handleApprove = () => {
    console.log('承認する')
  }

  return (
    <div className={styles.approvedUI}>
      <BaseTextarea
        label="コメント(差し戻す場合は必須)"
        value={comment}
        onChange={(value) => setComment(value)}
        placeholder="コメントを入力してください"
      />
      <div className={styles.buttonArea}>
        <BaseButton onClick={handleReject} variant="secondary">
          差し戻す
        </BaseButton>
        <BaseButton onClick={handleApprove} variant="primary">
          承認する
        </BaseButton>
      </div>
    </div>
  )
}
