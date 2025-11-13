import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/dateUtils'
import { User } from '@yurigaoka-app/common'
import { FieldValue } from 'firebase-admin/firestore'

const dateColumns = ['createdAt']

// すべての生徒を取得
export const fetchAllStudents = async (): Promise<User[]> => {
  const snapshot = await adminDb.collection('users').where('role', '==', 'student').get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const convertedData = convertDate({ ...data }, dateColumns)
    return {
      id: doc.id,
      ...convertedData,
    } as User
  })
}

export type LineupPosition = NonNullable<User['lineupPosition']>

export const updateStudentLineupPosition = async (
  studentId: string,
  position: LineupPosition | null
): Promise<void> => {
  const docRef = adminDb.collection('users').doc(studentId)

  if (position) {
    await docRef.update({
      lineupPosition: {
        column: position.column,
        row: position.row,
      },
    })
    return
  }

  await docRef.update({
    lineupPosition: FieldValue.delete(),
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
