import { HomecomingSubmission, MealAbsenceSubmission } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'

export const postHomecomingSubmission = async (submission: Omit<HomecomingSubmission, 'id'>) => {
  const submissionRef = adminDb.collection('submissions').doc()
  await submissionRef.set(submission)
}

export const postMealAbsenceSubmission = async (submission: Omit<MealAbsenceSubmission, 'id'>) => {
  const submissionRef = adminDb.collection('submissions').doc()
  await submissionRef.set(submission)
}
