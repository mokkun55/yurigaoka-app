'use server'

import { fetchPendingSubmissions } from '@/firestore/submission-operations'
import { fetchStudentById } from '@/firestore/user-operations'
import { HomecomingSubmission, MealAbsenceSubmission, Location } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'

export type SubmissionWithUserAndLocation =
  | (HomecomingSubmission & {
      userName: string
      userGrade?: string
      userClass?: string
      userPhoneNumber?: string
      userClub?: string
      locationAddress?: string
      locationName?: string
    })
  | (MealAbsenceSubmission & {
      userName: string
      userGrade?: string
      userClass?: string
      userPhoneNumber?: string
      userClub?: string
      locationAddress?: never
      locationName?: never
    })

export async function getPendingSubmissions(): Promise<SubmissionWithUserAndLocation[]> {
  try {
    const submissions = await fetchPendingSubmissions()

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
          userClub: user?.club,
          locationAddress,
          locationName,
        }
      })
    )

    return submissionsWithUser as SubmissionWithUserAndLocation[]
  } catch (error) {
    console.error('Failed to fetch pending submissions:', error)
    throw error
  }
}
