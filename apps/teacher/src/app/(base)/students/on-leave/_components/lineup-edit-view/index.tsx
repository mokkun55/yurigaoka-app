'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import styles from './styles.module.css'
import { StudentWithHomecoming, setStudentLineupPosition } from '../../actions'
import { LINEUP_MAX_COLUMNS, LINEUP_MAX_ROWS } from '../../constants'
import { Button, Text } from '@mantine/core'

type Props = {
  students: StudentWithHomecoming[]
  onClose?: () => void
}

type LineupPosition = NonNullable<StudentWithHomecoming['user']['lineupPosition']>

type StudentWithPosition = {
  student: StudentWithHomecoming
  position: LineupPosition | null
}

// ドラッグ可能な学生カードコンポーネント
function DraggableStudentCard({ student }: { student: StudentWithHomecoming; position: LineupPosition | null }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: student.user.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.studentCard}>
      <div className={styles.studentName}>{student.user.name}</div>
      <div className={styles.studentMeta}>{student.user.grade || '-'}年生</div>
    </div>
  )
}

// グリッドのセルコンポーネント
function GridCell({ column, row, student }: { column: number; row: number; student: StudentWithHomecoming | null }) {
  const cellId = `cell-${column}-${row}`
  const { setNodeRef, isOver } = useDroppable({
    id: cellId,
  })

  return (
    <div
      ref={setNodeRef}
      className={`${styles.cell} ${student ? styles.cellOccupied : styles.cellEmpty} ${isOver ? styles.cellOver : ''}`}
    >
      {student ? (
        <DraggableStudentCard student={student} position={{ column, row }} />
      ) : (
        <div className={styles.cellEmptyText}>空席</div>
      )}
    </div>
  )
}

// 未設定エリアコンポーネント
function UnassignedArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned-area',
  })

  return (
    <div ref={setNodeRef} className={`${styles.unassignedArea} ${isOver ? styles.unassignedAreaOver : ''}`}>
      {children}
    </div>
  )
}

export default function LineupEditView({ students, onClose }: Props) {
  const [localStudents, setLocalStudents] = useState<StudentWithPosition[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    const studentsWithPosition: StudentWithPosition[] = students.map((student) => ({
      student,
      position: student.user.lineupPosition ?? null,
    }))
    setLocalStudents(studentsWithPosition)
  }, [students])

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 3000)
    return () => clearTimeout(timer)
  }, [feedback])

  // 位置ごとの学生マップ
  const positionMap = useMemo(() => {
    const map = new Map<string, StudentWithHomecoming>()
    localStudents.forEach(({ student, position }) => {
      if (position) {
        const key = `${position.column}-${position.row}`
        map.set(key, student)
      }
    })
    return map
  }, [localStudents])

  // 未設定の学生リスト
  const unassignedStudents = useMemo(() => {
    return localStudents.filter(({ position }) => position === null).map(({ student }) => student)
  }, [localStudents])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const studentId = active.id as string
    const overId = over.id as string

    // グリッドセルにドロップされた場合
    if (overId.startsWith('cell-')) {
      const [, columnStr, rowStr] = overId.split('-')
      const column = parseInt(columnStr, 10)
      const row = parseInt(rowStr, 10)

      if (!isNaN(column) && !isNaN(row)) {
        const key = `${column}-${row}`
        const existingStudent = positionMap.get(key)

        // 既に他の学生がいる場合は、ドロップを拒否
        if (existingStudent && existingStudent.user.id !== studentId) {
          return
        }

        updateStudentPosition(studentId, { column, row })
      }
      return
    }

    // 未設定エリアにドロップされた場合
    if (overId === 'unassigned-area') {
      updateStudentPosition(studentId, null)
      return
    }
  }

  const updateStudentPosition = (studentId: string, position: LineupPosition | null) => {
    setLocalStudents((prev) =>
      prev.map((item) => {
        if (item.student.user.id === studentId) {
          return { ...item, position }
        }
        return item
      })
    )
  }

  const handleSaveAll = async (closeAfterSave = false) => {
    const changes = localStudents.filter(({ student, position }) => {
      const original = students.find((s) => s.user.id === student.user.id)
      const originalPosition = original?.user.lineupPosition ?? null
      return (
        position?.column !== originalPosition?.column ||
        position?.row !== originalPosition?.row ||
        (position === null && originalPosition !== null) ||
        (position !== null && originalPosition === null)
      )
    })

    if (changes.length === 0) {
      if (closeAfterSave && onClose) {
        onClose()
      } else {
        setFeedback({ type: 'success', message: '変更はありません。' })
      }
      return
    }

    startTransition(async () => {
      try {
        for (const { student, position } of changes) {
          await setStudentLineupPosition(student.user.id, position)
        }
        setFeedback({ type: 'success', message: 'すべての変更を保存しました。' })
        if (closeAfterSave && onClose) {
          onClose()
        }
      } catch (error) {
        console.error(error)
        setFeedback({ type: 'error', message: '保存に失敗しました。' })
      }
    })
  }

  const handleSaveAndClose = async () => {
    await handleSaveAll(true)
  }

  const activeStudent = activeId ? localStudents.find(({ student }) => student.user.id === activeId) : null

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Text fw={600} size="lg">
            並び順変更
          </Text>
          {onClose && (
            <Button variant="subtle" onClick={handleSaveAndClose} loading={isPending} disabled={isPending}>
              保存して閉じる
            </Button>
          )}
        </div>

        {feedback && (
          <div
            className={`${styles.feedback} ${feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}`}
          >
            {feedback.message}
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.gridSection}>
            <div className={styles.grid}>
              <div className={styles.gridHeaderRow}>
                <div className={styles.rowLabel}></div>
                {Array.from({ length: LINEUP_MAX_COLUMNS }, (_, colIndex) => {
                  const column = colIndex + 1
                  return (
                    <div key={column} className={styles.columnLabel}>
                      {column}列
                    </div>
                  )
                })}
              </div>
              {Array.from({ length: LINEUP_MAX_ROWS }, (_, rowIndex) => {
                const row = rowIndex + 1
                return (
                  <div key={row} className={styles.gridRow}>
                    <div className={styles.rowLabel}>{row}行</div>
                    {Array.from({ length: LINEUP_MAX_COLUMNS }, (_, colIndex) => {
                      const column = colIndex + 1
                      const key = `${column}-${row}`
                      const student = positionMap.get(key) || null
                      return <GridCell key={key} column={column} row={row} student={student} />
                    })}
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.unassignedSection}>
            <Text fw={600} mb="md">
              未設定
            </Text>
            <UnassignedArea>
              {unassignedStudents.map((student) => {
                const item = localStudents.find((item) => item.student.user.id === student.user.id)
                return (
                  <DraggableStudentCard key={student.user.id} student={student} position={item?.position ?? null} />
                )
              })}
              {unassignedStudents.length === 0 && <div className={styles.emptyMessage}>未設定の学生はいません</div>}
            </UnassignedArea>
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={() => handleSaveAll(false)} loading={isPending} disabled={isPending}>
            すべての変更を保存
          </Button>
        </div>

        <DragOverlay>
          {activeStudent && (
            <div className={styles.dragOverlay}>
              <div className={styles.studentName}>{activeStudent.student.user.name}</div>
              <div className={styles.studentMeta}>
                {activeStudent.student.user.grade || '-'}
                {activeStudent.student.user.class ? ` ${activeStudent.student.user.class}` : ''}
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
