'use server'

import { fetchAllStudents, updateStudentLineupPosition } from '@/firestore/user-operations'
import type { LineupPosition } from '@/firestore/user-operations'
import { fetchAllSubmissions } from '@/firestore/submission-operations'
import { User, HomecomingSubmission, Location, SystemConfig } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'
import { LINEUP_MAX_COLUMNS, LINEUP_MAX_ROWS } from './constants'
import { getSystemConfig } from '@/firestore/system-config-operations'

export type StudentWithHomecoming = {
  user: User
  homecomingSubmissions: HomecomingSubmission[]
  remarks?: string // 備考（例：退寮日など）
}

export type GradeGroup = '1年' | '2年' | '3年' | '指導寮生(4,5年)'

export type StudentsByGrade = {
  grade: GradeGroup
  students: StudentWithHomecoming[]
}

/**
 * 指定された月の帰省者データを取得
 * @param year 年
 * @param month 月（1-12）
 */
export async function getHomecomingData(year: number, month: number): Promise<StudentWithHomecoming[]> {
  try {
    // 全学生を取得
    const students = await fetchAllStudents()

    // 承認済みの帰省申請を取得
    const allSubmissions = await fetchAllSubmissions()
    const approvedHomecomingSubmissions = allSubmissions.filter(
      (submission): submission is HomecomingSubmission => submission.type === '帰省' && submission.status === 'approved'
    )

    // 指定された月の範囲を計算
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0) // 月の最後の日

    // 各学生に対して、指定月と重なる帰省申請を取得
    const studentsWithHomecoming = students
      .filter((student) => student.name && student.name.trim() !== '') // 名前がある学生のみ
      .map((student) => {
        // この学生の承認済み帰省申請で、指定月と重なるものを取得
        const relevantSubmissions = approvedHomecomingSubmissions
          .filter((submission) => submission.userId === student.id)
          .filter((submission) => {
            const submissionStart = new Date(submission.startDate)
            const submissionEnd = new Date(submission.endDate)

            // 申請期間が指定月と重なるかチェック
            return submissionStart <= endDate && submissionEnd >= startDate
          })
          .map((submission) => ({
            ...submission,
            startDate: submission.startDate instanceof Date ? submission.startDate : new Date(submission.startDate),
            endDate: submission.endDate instanceof Date ? submission.endDate : new Date(submission.endDate),
          }))

        return {
          user: student,
          homecomingSubmissions: relevantSubmissions,
        }
      })
      .sort((a, b) => {
        // 学年順にソート
        const gradeA = parseInt(a.user.grade?.match(/\d+/)?.[0] || '0')
        const gradeB = parseInt(b.user.grade?.match(/\d+/)?.[0] || '0')
        if (gradeA !== gradeB) {
          return gradeA - gradeB
        }
        // 学年が同じ場合は名前順
        const nameA = a.user.name || ''
        const nameB = b.user.name || ''
        return nameA.localeCompare(nameB, 'ja')
      })

    return studentsWithHomecoming
  } catch (error) {
    console.error('Failed to fetch homecoming data:', error)
    throw error
  }
}

export async function setStudentLineupPosition(studentId: string, position: LineupPosition | null): Promise<void> {
  if (position) {
    const { column, row } = position

    if (!Number.isInteger(column) || column < 1 || column > LINEUP_MAX_COLUMNS) {
      throw new Error('列番号が不正です。')
    }
    if (!Number.isInteger(row) || row < 1 || row > LINEUP_MAX_ROWS) {
      throw new Error('行番号が不正です。')
    }
  }

  await updateStudentLineupPosition(studentId, position)
}

/**
 * システム設定を取得
 */
export async function getSystemConfigAction(): Promise<SystemConfig> {
  return await getSystemConfig()
}

/**
 * Location情報を取得
 */
export async function getLocationById(locationId: string): Promise<Location | null> {
  try {
    const locationDoc = await adminDb.collection('locations').doc(locationId).get()
    if (!locationDoc.exists) {
      return null
    }
    const locationData = locationDoc.data()!
    const convertedData = convertDate({ ...locationData }, ['createdAt'])
    return { id: locationDoc.id, ...convertedData } as Location
  } catch (error) {
    console.error(`Failed to fetch location ${locationId}:`, error)
    return null
  }
}
