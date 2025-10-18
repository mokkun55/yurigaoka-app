'use client'

import styles from './styles.module.css'
import { useState } from 'react'
import Status from './_components/status'
import DateSelect from './_components/date-select'
import { SegmentedControl } from '@mantine/core'
import ListView from './_components/list-view'
import CardView from './_components/card-view'

export default function OnLeavePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [mode, setMode] = useState<'list' | 'card'>('list')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <DateSelect selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <Status selectedDate={selectedDate} />
      </div>
      <SegmentedControl
        data={[
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
        onChange={(value) => setMode(value as 'list' | 'card')}
        classNames={{ label: styles.label }}
        color="var(--main-blue)"
      />
      <div className={styles.content}>
        {mode === 'list' && <ListView />}
        {mode === 'card' && <CardView />}
      </div>
    </div>
  )
}
