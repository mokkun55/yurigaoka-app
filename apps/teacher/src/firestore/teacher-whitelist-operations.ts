import { TeacherWhitelist } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'
import { FieldValue } from 'firebase-admin/firestore'

const dateColumns = ['createdAt']

// すべての先生&寮長を取得
export const fetchAllTeacherWhitelist = async (): Promise<TeacherWhitelist[]> => {
  const snapshot = await adminDb.collection('teacherWhitelist').orderBy('createdAt', 'desc').get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const convertedData = convertDate({ ...data }, dateColumns)
    return {
      id: doc.id,
      ...convertedData,
    } as TeacherWhitelist
  })
}

// 先生&寮長を追加
export const createTeacherWhitelist = async (email: string, role: 'teacher' | 'manager'): Promise<string> => {
  const docRef = adminDb.collection('teacherWhitelist').doc()
  await docRef.set({
    email,
    role,
    createdAt: FieldValue.serverTimestamp(),
  })
  return docRef.id
}

// 先生&寮長を削除
export const deleteTeacherWhitelist = async (id: string): Promise<void> => {
  await adminDb.collection('teacherWhitelist').doc(id).delete()
}

// メールアドレスで先生&寮長を取得
export const fetchTeacherWhitelistByEmail = async (email: string): Promise<TeacherWhitelist | null> => {
  const snapshot = await adminDb.collection('teacherWhitelist').where('email', '==', email).limit(1).get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  const data = doc.data()
  const convertedData = convertDate({ ...data }, dateColumns)
  return {
    id: doc.id,
    ...convertedData,
  } as TeacherWhitelist
}
