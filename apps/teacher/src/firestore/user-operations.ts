import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'
import { User } from '@yurigaoka-app/common'

const dateColumns = ['createdAt']

// すべての生徒を取得
export const fetchAllStudents = async (): Promise<User[]> => {
  const snapshot = await adminDb.collection('users').get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const convertedData = convertDate({ ...data }, dateColumns)
    return {
      id: doc.id,
      ...convertedData,
    } as User
  })
}

// 特定の生徒を取得
export const fetchStudentById = async (studentId: string): Promise<User | null> => {
  const doc = await adminDb.collection('users').doc(studentId).get()

  if (!doc.exists) {
    return null
  }

  const data = doc.data()!
  const convertedData = convertDate({ ...data }, dateColumns)
  return {
    id: doc.id,
    ...convertedData,
  } as User
}
