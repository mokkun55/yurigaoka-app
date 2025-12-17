'use server'

import { fetchAllSubmissions, updateSubmissionStatus } from '@/firestore/submission-operations'
import { fetchStudentById } from '@/firestore/user-operations'
import { HomecomingSubmission, MealAbsenceSubmission, Location } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'
import { revalidatePath } from 'next/cache'
import { sendApprovalEmail, sendRejectionEmail } from '@/utils/email'

export type SubmissionWithUser = (HomecomingSubmission | MealAbsenceSubmission) & {
  userName: string
  userGrade?: string
  userClass?: string
  userPhoneNumber?: string
  locationName?: string
  locationAddress?: string
}

export async function getAllSubmissions(): Promise<SubmissionWithUser[]> {
  try {
    const submissions = await fetchAllSubmissions()

    // ユーザー情報とLocation情報を取得して結合
    const submissionsWithUser = await Promise.all(
      submissions.map(async (submission) => {
        const user = await fetchStudentById(submission.userId)

        // Location情報を取得（帰省申請の場合のみ）
        let locationAddress: string | undefined
        let locationName: string | undefined
        if (submission.type === '帰省') {
          try {
            const locationDoc = await adminDb.collection('locations').doc(submission.locationId).get()
            if (locationDoc.exists) {
              const locationData = locationDoc.data()!
              const convertedData = convertDate({ ...locationData }, ['createdAt'])
              const location = { id: locationDoc.id, ...convertedData } as Location
              locationAddress = location.address
              locationName = location.name
            }
          } catch (error) {
            console.error(`Failed to fetch location ${submission.locationId}:`, error)
          }
        }

        return {
          ...submission,
          userName: user?.name || `User ${submission.userId}`,
          userGrade: user?.grade,
          userClass: user?.class,
          userPhoneNumber: user?.phoneNumber,
          locationAddress,
          locationName,
        }
      })
    )

    return submissionsWithUser
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    throw error
  }
}

// 申請を承認
export async function approveSubmission(submissionId: string): Promise<void> {
  try {
    await updateSubmissionStatus(submissionId, 'approved')
    // メール送信（エラーが発生しても承認処理は続行）
    try {
      await sendApprovalEmail(submissionId)
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError)
      // メール送信に失敗しても承認処理は成功とする
    }
    revalidatePath('/reports')
  } catch (error) {
    console.error('Failed to approve submission:', error)
    throw error
  }
}

// 申請を差し戻し
export async function rejectSubmission(submissionId: string, rejectReason: string): Promise<void> {
  try {
    if (!rejectReason.trim()) {
      throw new Error('差し戻し理由は必須です')
    }
    await updateSubmissionStatus(submissionId, 'rejected', rejectReason)
    // メール送信（エラーが発生しても却下処理は続行）
    try {
      await sendRejectionEmail(submissionId, rejectReason)
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError)
      // メール送信に失敗しても却下処理は成功とする
    }
    revalidatePath('/reports')
  } catch (error) {
    console.error('Failed to reject submission:', error)
    throw error
  }
}
