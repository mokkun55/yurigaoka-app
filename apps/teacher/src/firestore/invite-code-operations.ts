import { InviteCode } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'
import { FieldValue } from 'firebase-admin/firestore'

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

// すべての招待コードを取得
export const fetchAllInviteCodes = async (): Promise<InviteCode[]> => {
  const snapshot = await adminDb.collection('inviteCodes').orderBy('createdAt', 'desc').get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const convertedData = convertDate({ ...data }, dateColumns)
    return {
      id: doc.id,
      ...convertedData,
    } as InviteCode
  })
}

// 招待コードを削除
export const deleteInviteCode = async (codeId: string): Promise<void> => {
  await adminDb.collection('inviteCodes').doc(codeId).delete()
}

// 7文字の英数字（大文字）の招待コードを生成
export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// コード文字列から招待コードを取得
export const fetchInviteCodeByCode = async (code: string): Promise<InviteCode | null> => {
  const snapshot = await adminDb.collection('inviteCodes').where('code', '==', code).limit(1).get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  const data = doc.data()
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
