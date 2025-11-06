import {
  Submission,
  MealAbsenceSubmission,
  HomecomingSubmission,
  MealOff,
  User,
  SubmissionStatus,
} from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate, convertFirestoreTimestampToDate } from '@/utils/dateUtils'
import { FieldPath, FieldValue } from 'firebase-admin/firestore'

// すべての申請を取得
export const fetchAllSubmissions = async (): Promise<Submission[]> => {
  const snapshot = await adminDb.collection('submissions').orderBy('createdAt', 'desc').get()

  return snapshot.docs.map((doc) => {
    return convertSubmissionDocument(doc.data(), doc.id)
  })
}

// 承認待ちの申請を取得
export const fetchPendingSubmissions = async (): Promise<Submission[]> => {
  const snapshot = await adminDb
    .collection('submissions')
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map((doc) => {
    return convertSubmissionDocument(doc.data(), doc.id)
  })
}

// 特定の申請詳細を取得
export const fetchSubmissionById = async (submissionId: string): Promise<Submission | null> => {
  const doc = await adminDb.collection('submissions').doc(submissionId).get()

  if (!doc.exists) {
    return null
  }

  return convertSubmissionDocument(doc.data()!, doc.id)
}

// 申請のステータスを変更
export const updateSubmissionStatus = async (
  submissionId: string,
  status: SubmissionStatus,
  rejectReason?: string
): Promise<void> => {
  const updateData: { status: SubmissionStatus; rejectReason?: string | FirebaseFirestore.FieldValue } = {
    status,
  }

  if (status === 'rejected') {
    if (rejectReason) {
      updateData.rejectReason = rejectReason
    }
  } else {
    // 他のステータスに変更する場合は rejectReason を削除
    updateData.rejectReason = FieldValue.delete()
  }

  await adminDb.collection('submissions').doc(submissionId).update(updateData)
}

// 帰省中の生徒を取得
export const fetchStudentsOnHomecoming = async (): Promise<Array<{ user: User; submission: HomecomingSubmission }>> => {
  const now = new Date()

  const snapshot = await adminDb
    .collection('submissions')
    .where('type', '==', '帰省')
    .where('status', '==', 'approved')
    .get()

  const activeSubmissions = snapshot.docs
    .map((doc) => {
      const data = doc.data()
      const submission = convertSubmissionDocument(data, doc.id) as HomecomingSubmission
      return { submission, userId: data.userId }
    })
    .filter(({ submission }) => {
      const startDate = submission.startDate instanceof Date ? submission.startDate : new Date(submission.startDate)
      const endDate = submission.endDate instanceof Date ? submission.endDate : new Date(submission.endDate)
      return now >= startDate && now <= endDate
    })

  // ユーザー情報を取得
  const userIds = [...new Set(activeSubmissions.map((s) => s.userId))]
  const usersSnapshot = await adminDb.collection('users').where(FieldPath.documentId(), 'in', userIds).get()

  const usersMap = new Map<string, User>(
    usersSnapshot.docs.map((doc) => {
      const data = doc.data()
      const convertedData = convertDate({ ...data }, ['createdAt'])
      return [
        doc.id,
        {
          id: doc.id,
          ...convertedData,
        } as User,
      ]
    })
  )

  return activeSubmissions
    .map(({ submission, userId }) => {
      const user = usersMap.get(userId)
      if (!user || user.role !== 'student') return null
      return { user, submission }
    })
    .filter((item): item is { user: User; submission: HomecomingSubmission } => item !== null)
}

// Firestore ドキュメントをSubmission型に変換するヘルパー関数
function convertSubmissionDocument(data: Record<string, unknown>, id: string): Submission {
  const baseData = {
    id,
    userId: data.userId as string,
    type: data.type as '帰省' | '欠食',
    status: data.status as Submission['status'],
    reason: data.reason as string,
    specialReason: data.specialReason as string | undefined,
    rejectReason: data.rejectReason as string | undefined,
    createdAt: convertFirestoreTimestampToDate(data.createdAt as FirebaseFirestore.Timestamp),
    mealsOff:
      (data.mealsOff as Array<{ date: FirebaseFirestore.Timestamp; breakfast: boolean; dinner: boolean }>)?.map(
        (meal): MealOff => ({
          ...meal,
          date: convertFirestoreTimestampToDate(meal.date),
        })
      ) || [],
  }

  if (data.type === '帰省') {
    return {
      ...baseData,
      startDate: convertFirestoreTimestampToDate(data.startDate as FirebaseFirestore.Timestamp),
      endDate: convertFirestoreTimestampToDate(data.endDate as FirebaseFirestore.Timestamp),
      locationId: data.locationId as string,
    } as HomecomingSubmission
  } else {
    return baseData as MealAbsenceSubmission
  }
}
