import type { Submission, SubmissionData } from '@yurigaoka-app/common'
import * as admin from 'firebase-admin'

export const submissionConverter = {
  toFirestore: (submission: SubmissionData) => {
    if (submission.type === '帰省') {
      return {
        userId: submission.userId,
        type: submission.type,
        startDate: submission.startDate,
        endDate: submission.endDate,
        status: submission.status,
        reason: submission.reason,
        specialReason: submission.specialReason,
        locationId: submission.locationId,
        createdAt: submission.createdAt,
        mealsOff: submission.mealsOff,
      }
    } else {
      return {
        userId: submission.userId,
        type: submission.type,
        status: submission.status,
        reason: submission.reason,
        specialReason: submission.specialReason,
        createdAt: submission.createdAt,
        mealsOff: submission.mealsOff,
      }
    }
  },
  fromFirestore: (snapshot: admin.firestore.QueryDocumentSnapshot) => {
    const data = snapshot.data()

    // mealsOffの変換: MealOffData[] -> MealOff[]
    const mealsOff = (data.mealsOff || []).map((meal: { date: string; breakfast: boolean; dinner: boolean }) => ({
      date: new Date(meal.date),
      breakfast: meal.breakfast,
      dinner: meal.dinner,
    }))

    const baseSubmission = {
      id: snapshot.id,
      userId: data.userId,
      type: data.type,
      status: data.status,
      reason: data.reason,
      specialReason: data.specialReason,
      createdAt: data.createdAt.toDate(),
      mealsOff,
    }

    // typeによって適切な型を返す
    if (data.type === '帰省') {
      return {
        ...baseSubmission,
        type: '帰省',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        locationId: data.locationId,
      } as Submission
    } else if (data.type === '欠食') {
      return {
        ...baseSubmission,
        type: '欠食',
      } as Submission
    } else {
      throw new Error(`Unknown submission type: ${data.type}`)
    }
  },

  fromQuerySnapshot: (querySnapshot: admin.firestore.QuerySnapshot) => {
    return querySnapshot.docs.map((doc) => submissionConverter.fromFirestore(doc))
  },
}
