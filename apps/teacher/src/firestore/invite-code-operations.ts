import { InviteCode } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'

const dateColumns = ['createdAt', 'limitDate']

// 招待コードを取得
export const fetchInviteCode = async (codeId: string): Promise<InviteCode | null> => {
  const doc = await adminDb.collection('inviteCodes').doc(codeId).get()

  if (!doc.exists) {
    return null
  }

  const data = doc.data()!
  const convertedData = convertDate({ ...data }, dateColumns)
  return {
    id: doc.id,
    ...convertedData,
  } as InviteCode
}

// 招待コードを作成
export const createInviteCode = async (code: Omit<InviteCode, 'id'>): Promise<string> => {
  const docRef = adminDb.collection('inviteCodes').doc()
  await docRef.set(code)
  return docRef.id
}
