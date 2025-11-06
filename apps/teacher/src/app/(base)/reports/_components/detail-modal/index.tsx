'use client'

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
import { approveSubmission, rejectSubmission } from '../../actions'
import { useRouter } from 'next/navigation'

type Props = {
  report: Report
  onClose: () => void
}

const reportTypeMap = {
  homecoming: '帰省・欠食届',
  meal: '欠食届のみ',
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
        {report.type === 'homecoming' &&
          report.startDate &&
          report.endDate &&
          report.homeName &&
          report.address &&
          report.phoneNumber &&
          report.reason && (
            <HomecomingInfo
              startDate={report.startDate}
              endDate={report.endDate}
              homeName={report.homeName}
              address={report.address}
              phoneNumber={report.phoneNumber}
              reason={report.reason}
              specialReason={report.specialReason}
              meals={report.meals}
            />
          )}

        {/* 欠食情報 */}
        {report.type === 'meal' && report.startDate && report.endDate && report.reason && (
          <MealAbsenceInfo
            startDate={report.startDate}
            endDate={report.endDate}
            meals={report.meals || { startMeal: [false, false], endMeal: [false, false] }}
            reason={report.reason}
          />
        )}

        {/* 承認UI (申請中の場合) */}
        {report.status === 'pending' && (
          <>
            <ApprovedUI report={report} onClose={onClose} />
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
type ApprovedUIProps = {
  report: Report
  onClose: () => void
}

const ApprovedUI = ({ report, onClose }: ApprovedUIProps) => {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReject = async () => {
    if (!comment.trim()) {
      alert('差し戻し理由を入力してください')
      return
    }

    setLoading(true)
    try {
      await rejectSubmission(report.id, comment)
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Failed to reject submission:', error)
      alert('差し戻しに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setLoading(true)
    try {
      await approveSubmission(report.id)
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Failed to approve submission:', error)
      alert('承認に失敗しました')
    } finally {
      setLoading(false)
    }
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
        <BaseButton onClick={handleReject} variant="secondary" idDisabled={loading}>
          差し戻す
        </BaseButton>
        <BaseButton onClick={handleApprove} variant="primary" idDisabled={loading}>
          承認する
        </BaseButton>
      </div>
    </div>
  )
}
