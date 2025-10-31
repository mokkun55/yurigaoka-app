'use server'

import { fetchAllSubmissions } from '@/firestore/submission-operations'
import { fetchStudentById } from '@/firestore/user-operations'
import { HomecomingSubmission, MealAbsenceSubmission } from '@yurigaoka-app/common'

export type SubmissionWithUser = (HomecomingSubmission | MealAbsenceSubmission) & {
  userName: string
  userGrade?: string
  userClass?: string
}

export async function getAllSubmissions(): Promise<SubmissionWithUser[]> {
  try {
    const submissions = await fetchAllSubmissions()

    // ユーザー情報を取得して結合
    const submissionsWithUser = await Promise.all(
      submissions.map(async (submission) => {
        const user = await fetchStudentById(submission.userId)
        return {
          ...submission,
          userName: user?.name || `User ${submission.userId}`,
          userGrade: user?.grade,
          userClass: user?.class,
        }
      })
    )

    return submissionsWithUser
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    throw error
  }
}
