'use client'

import styles from '../styles.module.css'
import { User } from '@yurigaoka-app/common'
import StudentTable from './student-table'
import { useState } from 'react'
import { BaseSelect } from '@/ui/base-select'
import { BaseInput } from '@/ui/base-input'

type StudentWithStatus = User & {
  name: string
  club: string
  status: 'stay'
}

type Props = {
  initialStudents: StudentWithStatus[]
}

export default function StudentsClient({ initialStudents }: Props) {
  const [searchValue, setSearchValue] = useState<string>('')
  const [gradeFilter, setGradeFilter] = useState<string | null>(null)
  const [clubFilter, setClubFilter] = useState<string | null>(null)

  // フィルター
  const filteredStudents = initialStudents
    .filter((student) => {
      if (gradeFilter && student.grade !== gradeFilter) return false
      if (clubFilter && student.club !== clubFilter) return false
      if (searchValue && !student.name.toLowerCase().includes(searchValue.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      // 学年順にソート
      const gradeA = parseInt(a.grade?.match(/\d+/)?.[0] || '0')
      const gradeB = parseInt(b.grade?.match(/\d+/)?.[0] || '0')
      if (gradeA !== gradeB) {
        return gradeA - gradeB
      }

      // 学年が同じ場合はクラス順（アルファベット順）にソート
      const classA = a.class ?? ''
      const classB = b.class ?? ''
      return classA.localeCompare(classB)
    })

  // 動的に学年と部活動のリストを生成
  const gradeOptions = Array.from(new Set(initialStudents.map((s) => s.grade).filter(Boolean))).sort((a, b) => {
    // 学年文字列から数字を抽出して比較
    const numA = parseInt(a?.match(/\d+/)?.[0] || '0')
    const numB = parseInt(b?.match(/\d+/)?.[0] || '0')
    return numA - numB
  }) as string[]
  const clubOptions = Array.from(new Set(initialStudents.map((s) => s.club).filter(Boolean))).sort((a, b) => {
    // 「未所属/その他」を最後にする
    if (a === '未所属/その他') return 1
    if (b === '未所属/その他') return -1
    return (a ?? '').localeCompare(b ?? '')
  }) as string[]

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <BaseInput
          label="名前"
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
          placeholder="名前を入力"
        />
        <BaseSelect
          label="学年"
          placeholder="学年を選択"
          value={gradeFilter ?? ''}
          onChange={(value) => setGradeFilter(value || null)}
          data={gradeOptions}
        />
        <BaseSelect
          label="部活動"
          placeholder="部活動を選択"
          value={clubFilter ?? ''}
          onChange={(value) => setClubFilter(value || null)}
          data={clubOptions}
        />
      </div>
      <div className={styles.studentList}>
        <StudentTable students={filteredStudents} />
      </div>
    </div>
  )
}
