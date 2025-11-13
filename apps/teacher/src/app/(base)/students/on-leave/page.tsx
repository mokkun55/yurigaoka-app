'use client'

import styles from './styles.module.css'
import { useState, useEffect } from 'react'
import { SegmentedControl } from '@mantine/core'
import MonthSelect from './_components/month-select'
import DateSelect from './_components/date-select'
import TableView from './_components/table-view'
import LineupView from './_components/lineup-view'
import LineupEditView from './_components/lineup-edit-view'
import { getHomecomingData, StudentWithHomecoming } from './actions'

export default function OnLeavePage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState(now)
  const [mode, setMode] = useState<'table' | 'list' | 'edit'>('table')
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
        {mode === 'table' ? (
          <MonthSelect year={year} month={month} onYearMonthChange={handleYearMonthChange} />
        ) : (
          <DateSelect selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        )}
        <SegmentedControl
          data={[
            {
              label: 'テーブル表示',
              value: 'table',
            },
            {
              label: '並び順表示',
              value: 'list',
            },
          ]}
          value={mode}
          onChange={(value) => setMode(value as 'table' | 'list')}
          classNames={{ label: styles.label }}
          color="var(--main-blue)"
        />
      </div>
      <div className={styles.content}>
        {(() => {
          if (loading) {
            return <div>読み込み中...</div>
          }
          if (mode === 'table') {
            return <TableView students={students} year={year} month={month} />
          }
          if (mode === 'list') {
            return <LineupView students={students} selectedDate={selectedDate} onEditClick={() => setMode('edit')} />
          }
          if (mode === 'edit') {
            return (
              <LineupEditView
                students={students}
                onClose={() => {
                  setMode('list')
                  // データを再読み込み
                  const loadData = async () => {
                    try {
                      const data = await getHomecomingData(year, month)
                      setStudents(data)
                    } catch (error) {
                      console.error('Failed to load homecoming data:', error)
                    }
                  }
                  loadData()
                }}
              />
            )
          }
        })()}
      </div>
    </div>
  )
}
