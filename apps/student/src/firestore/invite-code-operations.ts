import { InviteCode } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/convert-date'
import { FieldValue } from 'firebase-admin/firestore'

const dateColumns = ['createdAt', 'limitDate']

// コード文字列から招待コードを取得
export const fetchInviteCodeByCode = async (code: string): Promise<InviteCode | null> => {
  const snapshot = await adminDb.collection('inviteCodes').where('code', '==', code).limit(1).get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  const data = doc.data()
  if (!data) {
    return null
  }
  const convertedData = convertDate({ ...data }, dateColumns)
  return {
    id: doc.id,
    ...convertedData,
  } as InviteCode
}

// 招待コードの使用回数をインクリメント
export const incrementInviteCodeUsage = async (codeId: string): Promise<void> => {
  await adminDb
    .collection('inviteCodes')
    .doc(codeId)
    .update({
      useCount: FieldValue.increment(1),
    })
}
