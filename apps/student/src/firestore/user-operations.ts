import { adminDb } from '@/lib/firebase/admin'
import { convertDate } from '@/utils/convert-date'
import { User } from '@yurigaoka-app/common'

const dateColumns = ['createdAt', 'locations.createdAt']

export const fetchUserOperation = async (userId: string): Promise<User | null> => {
  const snapshot = await adminDb.collection('users').doc(userId).get()
  const data = snapshot.data()
  if (!data) {
    return null
  }
  return { id: userId, ...convertDate(data, dateColumns) } as User
}
