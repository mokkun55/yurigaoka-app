import { HomecomingSubmission } from '@yurigaoka-app/common'
import { StudentWithHomecoming, GradeGroup, StudentsByGrade } from './actions'

/**
 * 指定された日付が帰省期間内かどうかをチェック
 */
export function isDateInHomecomingRange(date: Date, submissions: HomecomingSubmission[]): boolean {
  return submissions.some((submission) => {
    const startDate = submission.startDate instanceof Date ? submission.startDate : new Date(submission.startDate)
    const endDate = submission.endDate instanceof Date ? submission.endDate : new Date(submission.endDate)

    // 日付のみで比較（時刻は無視）
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

    return checkDate >= start && checkDate <= end
  })
}

/**
 * 指定された日時（7:30）の時点で帰省中かどうかをチェック
 */
export function isMorningRollCallHomecoming(date: Date, submissions: HomecomingSubmission[]): boolean {
  // その日の7:30の時刻を作成
  const morningTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7, 30, 0)

  return submissions.some((submission) => {
    const startDate = submission.startDate instanceof Date ? submission.startDate : new Date(submission.startDate)
    const endDate = submission.endDate instanceof Date ? submission.endDate : new Date(submission.endDate)

    // 7:30の時点で帰省開始時刻以降なら帰省中（不在）
    return morningTime >= startDate && morningTime <= endDate
  })
}

/**
 * 指定された日時（20:30）の時点で帰省中かどうかをチェック
 */
export function isEveningRollCallHomecoming(date: Date, submissions: HomecomingSubmission[]): boolean {
  // その日の20:30の時刻を作成
  const eveningTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 30, 0)

  return submissions.some((submission) => {
    const startDate = submission.startDate instanceof Date ? submission.startDate : new Date(submission.startDate)
    const endDate = submission.endDate instanceof Date ? submission.endDate : new Date(submission.endDate)

    // 20:30の時点で帰省開始時刻以降かつ帰省終了時刻より前なら帰省中（不在）
    return eveningTime >= startDate && eveningTime <= endDate
  })
}

/**
 * 学生を学年ごとにグループ化
 */
export function groupStudentsByGrade(students: StudentWithHomecoming[]): StudentsByGrade[] {
  const groups: Record<GradeGroup, StudentWithHomecoming[]> = {
    '1年': [],
    '2年': [],
    '3年': [],
    '指導寮生(4,5年)': [],
  }

  students.forEach((student) => {
    const grade = student.user.grade || ''
    const gradeNum = parseInt(grade.match(/\d+/)?.[0] || '0')

    if (gradeNum === 1) {
      groups['1年'].push(student)
    } else if (gradeNum === 2) {
      groups['2年'].push(student)
    } else if (gradeNum === 3) {
      groups['3年'].push(student)
    } else if (gradeNum === 4 || gradeNum === 5) {
      groups['指導寮生(4,5年)'].push(student)
    }
  })

  // 各グループ内で名前順にソート
  Object.keys(groups).forEach((grade) => {
    groups[grade as GradeGroup].sort((a, b) => {
      const nameA = a.user.name || ''
      const nameB = b.user.name || ''
      return nameA.localeCompare(nameB, 'ja')
    })
  })

  return [
    { grade: '1年' as GradeGroup, students: groups['1年'] },
    { grade: '2年' as GradeGroup, students: groups['2年'] },
    { grade: '3年' as GradeGroup, students: groups['3年'] },
    { grade: '指導寮生(4,5年)' as GradeGroup, students: groups['指導寮生(4,5年)'] },
  ].filter((group) => group.students.length > 0) // 学生がいるグループのみ返す
}
