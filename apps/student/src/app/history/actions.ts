'use server'

import { fetchUserSubmissions, fetchSubmissionById } from '@/firestore/submission-operations'
import { fetchLocation } from '@/firestore/location-operations'
import { Submission, Location } from '@yurigaoka-app/common'

// ユーザーの申請履歴を取得
export async function getUserSubmissions(uid: string): Promise<Submission[]> {
  return await fetchUserSubmissions(uid)
}

// 特定の申請詳細を取得
export async function getSubmissionById(submissionId: string): Promise<Submission | null> {
  return await fetchSubmissionById(submissionId)
}

// 特定のlocation情報を取得
export async function getLocationById(locationId: string): Promise<Location | null> {
  return await fetchLocation(locationId)
}
