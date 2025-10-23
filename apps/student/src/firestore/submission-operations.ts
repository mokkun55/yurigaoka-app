import { HomecomingSubmission } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'

export const postHomecomingSubmission = async (submission: Omit<HomecomingSubmission, 'id'>) => {
  const submissionRef = adminDb.collection('submissions').doc()
  await submissionRef.set(submission)
}
