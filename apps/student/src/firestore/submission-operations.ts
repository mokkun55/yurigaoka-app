import { HomecomingSubmission, MealAbsenceSubmission, Submission, MealOff } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertFirestoreTimestampToDate } from '@/utils/dateUtils'

export const postHomecomingSubmission = async (submission: Omit<HomecomingSubmission, 'id'>) => {
  const submissionRef = adminDb.collection('submissions').doc()
  await submissionRef.set(submission)
}

export const postMealAbsenceSubmission = async (submission: Omit<MealAbsenceSubmission, 'id'>) => {
  const submissionRef = adminDb.collection('submissions').doc()
  await submissionRef.set(submission)
}

// ユーザーの申請履歴を取得
export const fetchUserSubmissions = async (userId: string): Promise<Submission[]> => {
  const submissionsSnapshot = await adminDb
    .collection('submissions')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  return submissionsSnapshot.docs.map((doc) => {
    const data = doc.data()!
    return {
      id: doc.id,
      ...data,
      createdAt: convertFirestoreTimestampToDate(data.createdAt),
      startDate: data.startDate ? convertFirestoreTimestampToDate(data.startDate) : undefined,
      endDate: data.endDate ? convertFirestoreTimestampToDate(data.endDate) : undefined,
      mealsOff: data.mealsOff?.map(
        (meal: { date: FirebaseFirestore.Timestamp; breakfast: boolean; dinner: boolean }): MealOff => ({
          ...meal,
          date: convertFirestoreTimestampToDate(meal.date),
        })
      ),
    } as Submission
  })
}

// 特定の申請詳細を取得
export const fetchSubmissionById = async (submissionId: string): Promise<Submission | null> => {
  const submissionDoc = await adminDb.collection('submissions').doc(submissionId).get()

  if (!submissionDoc.exists) {
    return null
  }

  const data = submissionDoc.data()!
  return {
    id: submissionDoc.id,
    ...data,
    createdAt: convertFirestoreTimestampToDate(data.createdAt),
    startDate: data.startDate ? convertFirestoreTimestampToDate(data.startDate) : undefined,
    endDate: data.endDate ? convertFirestoreTimestampToDate(data.endDate) : undefined,
    mealsOff: data.mealsOff?.map(
      (meal: { date: FirebaseFirestore.Timestamp; breakfast: boolean; dinner: boolean }): MealOff => ({
        ...meal,
        date: convertFirestoreTimestampToDate(meal.date),
      })
    ),
  } as Submission
}
