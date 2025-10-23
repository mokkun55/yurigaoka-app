'use server'

import { fetchUserSubmissions, fetchSubmissionById } from '@/firestore/submission-operations'
import { Submission } from '@yurigaoka-app/common'

// ユーザーの申請履歴を取得
export async function getUserSubmissions(uid: string): Promise<Submission[]> {
  return await fetchUserSubmissions(uid)
}

// 特定の申請詳細を取得
export async function getSubmissionById(submissionId: string): Promise<Submission | null> {
  return await fetchSubmissionById(submissionId)
}
