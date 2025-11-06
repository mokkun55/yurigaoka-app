'use client'

import styles from './styles.module.css'
import { useState, useEffect } from 'react'
import { SegmentedControl } from '@mantine/core'
import MonthSelect from './_components/month-select'
import TableView from './_components/table-view'
import { getHomecomingData, StudentWithHomecoming } from './actions'

export default function OnLeavePage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [mode, setMode] = useState<'table' | 'list' | 'card'>('table')
  const [students, setStudents] = useState<StudentWithHomecoming[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await getHomecomingData(year, month)
        setStudents(data)
      } catch (error) {
        console.error('Failed to load homecoming data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [year, month])

  const handleYearMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear)
    setMonth(newMonth)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MonthSelect year={year} month={month} onYearMonthChange={handleYearMonthChange} />
      </div>
      <SegmentedControl
        data={[
          {
            label: 'テーブル表示',
            value: 'table',
          },
          {
            label: '一覧表示',
            value: 'list',
          },
          {
            label: 'カード表示',
            value: 'card',
          },
        ]}
        value={mode}
        onChange={(value) => setMode(value as 'table' | 'list' | 'card')}
        classNames={{ label: styles.label }}
        color="var(--main-blue)"
      />
      <div className={styles.content}>
        {loading ? (
          <div>読み込み中...</div>
        ) : mode === 'table' ? (
          <TableView students={students} year={year} month={month} />
        ) : (
          <div>他の表示モードは今後実装予定</div>
        )}
      </div>
    </div>
  )
}
