'use client'

import styles from './styles.module.css'
import ReportTable from './_components/report-table'
import { useState } from 'react'
import { BaseSelect } from '@/ui/base-select'
import { BaseInput } from '@/ui/base-input'
import { Report } from './_type/report'

// TODO あとで動的に取得
const reports: Report[] = [
  {
    id: 1,
    name: '山田太郎',
    grade: 1,
    class: '1',
    type: 'homecoming',
    createdAt: new Date('2024-01-15T10:30:00'),
    status: 'pending',
  },
  {
    id: 2,
    name: '鈴木花子',
    grade: 2,
    class: '3',
    type: 'meal',
    createdAt: new Date('2024-01-14T14:20:00'),
    status: 'approved',
  },
  {
    id: 3,
    name: '佐藤一郎',
    grade: 3,
    class: '2',
    type: 'homecoming',
    createdAt: new Date('2024-01-13T09:15:00'),
    status: 'rejected',
    rejectReason: '帰省理由が不適切です',
  },
  {
    id: 4,
    name: '田中美咲',
    grade: 1,
    class: '2',
    type: 'meal',
    createdAt: new Date('2024-01-12T16:45:00'),
    status: 'pending',
  },
  {
    id: 5,
    name: '伊藤健一',
    grade: 2,
    class: '1',
    type: 'homecoming',
    createdAt: new Date('2024-01-11T11:00:00'),
    status: 'approved',
  },
  {
    id: 6,
    name: '渡辺直人',
    grade: 3,
    class: '3',
    type: 'meal',
    createdAt: new Date('2024-01-10T13:30:00'),
    status: 'canceled',
  },
  {
    id: 7,
    name: '小林優子',
    grade: 1,
    class: '3',
    type: 'homecoming',
    createdAt: new Date('2024-01-09T08:45:00'),
    status: 'pending',
  },
  {
    id: 8,
    name: '加藤修平',
    grade: 2,
    class: '2',
    type: 'meal',
    createdAt: new Date('2024-01-08T15:20:00'),
    status: 'approved',
  },
  {
    id: 9,
    name: '吉田真由',
    grade: 3,
    class: '1',
    type: 'homecoming',
    createdAt: new Date('2024-01-07T12:10:00'),
    status: 'rejected',
    rejectReason: '帰省理由が不適切です',
  },
  {
    id: 10,
    name: '山本和也',
    grade: 1,
    class: '1',
    type: 'meal',
    createdAt: new Date('2024-01-06T17:35:00'),
    status: 'pending',
  },
  {
    id: 11,
    name: '中村美咲',
    grade: 2,
    class: '3',
    type: 'homecoming',
    createdAt: new Date('2024-01-05T10:50:00'),
    status: 'approved',
  },
  {
    id: 12,
    name: '斎藤健太',
    grade: 3,
    class: '2',
    type: 'meal',
    createdAt: new Date('2024-01-04T14:15:00'),
    status: 'canceled',
  },
  {
    id: 13,
    name: '高橋由美',
    grade: 1,
    class: '2',
    type: 'homecoming',
    createdAt: new Date('2024-01-03T09:25:00'),
    status: 'pending',
  },
  {
    id: 14,
    name: '松本龍太郎',
    grade: 2,
    class: '1',
    type: 'meal',
    createdAt: new Date('2024-01-02T16:00:00'),
    status: 'approved',
  },
  {
    id: 15,
    name: '木村花',
    grade: 3,
    class: '3',
    type: 'homecoming',
    createdAt: new Date('2024-01-01T11:40:00'),
    status: 'rejected',
    rejectReason: '帰省理由が不適切です',
  },
  {
    id: 16,
    name: '井上大輔',
    grade: 1,
    class: '3',
    type: 'meal',
    createdAt: new Date('2023-12-31T13:55:00'),
    status: 'pending',
  },
  {
    id: 17,
    name: '清水美樹',
    grade: 2,
    class: '2',
    type: 'homecoming',
    createdAt: new Date('2023-12-30T08:30:00'),
    status: 'approved',
  },
  {
    id: 18,
    name: '山口智也',
    grade: 3,
    class: '1',
    type: 'meal',
    createdAt: new Date('2023-12-29T15:10:00'),
    status: 'canceled',
  },
  {
    id: 19,
    name: '阿部真理子',
    grade: 1,
    class: '1',
    type: 'homecoming',
    createdAt: new Date('2023-12-28T12:25:00'),
    status: 'pending',
  },
  {
    id: 20,
    name: '藤田翔太',
    grade: 2,
    class: '3',
    type: 'meal',
    createdAt: new Date('2023-12-27T17:45:00'),
    status: 'approved',
  },
]

export default function StudentsPage() {
  const [searchValue, setSearchValue] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // ステータスの日本語マッピング
  const statusMap = {
    申請中: 'pending',
    承認済: 'approved',
    却下: 'rejected',
    キャンセル: 'canceled',
  }

  // フィルター
  const filteredReports = reports.filter((report) => {
    // ステータスフィルター
    if (statusFilter && report.status !== statusMap[statusFilter as keyof typeof statusMap]) {
      return false
    }

    // 名前検索フィルター
    if (searchValue && !report.name.includes(searchValue)) {
      return false
    }

    return true
  })

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <BaseInput
          label="名前"
          value={searchValue ?? ''}
          onChange={(value) => setSearchValue(value)}
          placeholder="名前を入力"
        />
        <BaseSelect
          label="ステータス"
          placeholder="ステータスを選択"
          value={statusFilter ?? ''}
          onChange={(value) => setStatusFilter(value)}
          data={['申請中', '承認済', '却下', 'キャンセル']}
        />
      </div>
      <div className={styles.reportList}>
        <ReportTable reports={filteredReports} />
      </div>
    </div>
  )
}
