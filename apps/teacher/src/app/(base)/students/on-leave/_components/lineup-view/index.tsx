'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './styles.module.css'
import { StudentWithHomecoming } from '../../actions'
import { LINEUP_MAX_COLUMNS, LINEUP_MAX_ROWS } from '../../constants'
import { Button, SegmentedControl } from '@mantine/core'
import { isMorningRollCallHomecomingAt740, isEveningRollCallHomecoming } from '../../utils'
import { RollCallTime } from '@yurigaoka-app/common'

type Props = {
  students: StudentWithHomecoming[]
  selectedDate: Date
  onEditClick?: () => void
  rollCallTime: RollCallTime
}

type RollCallType = 'morning' | 'evening'

type OccupantEntry = {
  student: StudentWithHomecoming
}

type OccupantMap = Map<string, OccupantEntry[]>

const VISIBLE_COLUMNS = 4

export default function LineupView({ students, selectedDate, onEditClick, rollCallTime }: Props) {
  const [localStudents, setLocalStudents] = useState(students)
  const [columnStart, setColumnStart] = useState(1)
  const [rollCallType, setRollCallType] = useState<RollCallType>('morning')

  useEffect(() => {
    setLocalStudents(students)
  }, [students])

  const cellOccupants: OccupantMap = useMemo(() => {
    const map: OccupantMap = new Map()

    localStudents.forEach((student) => {
      const position = student.user.lineupPosition
      if (!position) return
      const key = `${position.column}-${position.row}`
      const entries = map.get(key) ?? []
      entries.push({ student })
      map.set(key, entries)
    })

    return map
  }, [localStudents])

  const maxColumnStart = Math.max(1, LINEUP_MAX_COLUMNS - VISIBLE_COLUMNS + 1)

  const handleShift = (direction: 'prev' | 'next') => {
    setColumnStart((prev) => {
      if (direction === 'prev') {
        return Math.max(1, prev - VISIBLE_COLUMNS)
      }
      if (direction === 'next') {
        return Math.min(maxColumnStart, prev + VISIBLE_COLUMNS)
      }
      return prev
    })
  }

  const visibleColumns = useMemo(() => {
    const columns: number[] = []
    for (let col = columnStart; col < columnStart + VISIBLE_COLUMNS && col <= LINEUP_MAX_COLUMNS; col++) {
      columns.push(col)
    }
    return columns
  }, [columnStart])

  return (
    <div className={styles.container}>
      <div className={styles.rollCallSelector}>
        <SegmentedControl
          data={[
            {
              label: '朝点呼',
              value: 'morning',
            },
            {
              label: '夜点呼',
              value: 'evening',
            },
          ]}
          value={rollCallType}
          onChange={(value) => setRollCallType(value as RollCallType)}
          classNames={{ label: styles.rollCallLabel }}
          color="var(--main-blue)"
        />
      </div>
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <Button variant="subtle" onClick={() => handleShift('prev')} disabled={columnStart === 1}>
            〈
          </Button>
          <p className={styles.rangeLabel}>
            {columnStart}列〜{visibleColumns[visibleColumns.length - 1]}列
          </p>
          <Button variant="subtle" onClick={() => handleShift('next')} disabled={columnStart >= maxColumnStart}>
            〉
          </Button>
        </div>
        {onEditClick && (
          <Button onClick={onEditClick} color="var(--main-blue)">
            並び順変更
          </Button>
        )}
      </div>
      <div className={styles.board} style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(0, 1fr))` }}>
        {visibleColumns.map((column) => (
          <div key={column} className={styles.column}>
            <div className={styles.columnHeader}>{column}列</div>
            {Array.from({ length: LINEUP_MAX_ROWS }, (_, rowIndex) => {
              const row = rowIndex + 1
              const key = `${column}-${row}`
              const entries = cellOccupants.get(key)
              if (!entries || entries.length === 0) {
                return (
                  <div key={key} className={`${styles.cell} ${styles.cellEmpty}`}>
                    空席
                  </div>
                )
              }
              const first = entries[0]
              const hasConflict = entries.length > 1
              const isWithdrawn = first.student.user.isDeleted || false

              // 選択された点呼時刻に応じて帰省者を判定
              const isHomecoming =
                rollCallType === 'morning'
                  ? isMorningRollCallHomecomingAt740(selectedDate, first.student.homecomingSubmissions, rollCallTime)
                  : isEveningRollCallHomecoming(selectedDate, first.student.homecomingSubmissions, rollCallTime)

              // カードのクラス名を決定
              let cellClassName = styles.cell
              if (isWithdrawn) {
                cellClassName += ` ${styles.cellWithdrawn}`
              } else if (isHomecoming) {
                cellClassName += ` ${styles.cellHomecoming}`
              }
              if (hasConflict) {
                cellClassName += ` ${styles.cellConflict}`
              }

              return (
                <div key={key} className={cellClassName}>
                  <div className={styles.studentName}>{first.student.user.name}</div>
                  <div className={styles.studentMeta}>{first.student.user.grade || '-'}年生</div>
                  {hasConflict && <div className={styles.conflictNote}>他{entries.length - 1}名</div>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
