'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { BaseSelect } from '@/ui/base-select'
import { BaseInput } from '@/ui/base-input'
import ReportTable from './report-table'
import { Report } from '../_type/report'
import styles from '../styles.module.css'

type Props = {
  reports: Report[]
}

export default function ReportsClient({ reports }: Props) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  // ステータスの日本語マッピング
  const statusMap = {
    申請中: 'pending',
    承認済: 'approved',
    却下: 'rejected',
    キャンセル: 'canceled',
  }

  // URLパラメータを更新
  const updateSearchParams = (name: string, value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
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
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value)
            updateSearchParams('name', value)
          }}
          placeholder="名前を入力"
        />
        <BaseSelect
          label="ステータス"
          placeholder="ステータスを選択"
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value)
            updateSearchParams('status', value)
          }}
          data={['申請中', '承認済', '却下', 'キャンセル']}
        />
      </div>
      <div className={styles.reportList}>
        {isPending ? <div>読み込み中...</div> : <ReportTable reports={filteredReports} />}
      </div>
    </div>
  )
}
