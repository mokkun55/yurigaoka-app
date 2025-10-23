import { adminDb } from '@/lib/firebase/admin'
import { Location } from '@yurigaoka-app/common'
import { convertDate } from '@/utils/convert-date'

const dateColumns = ['createdAt']

export const createLocation = async (location: Omit<Location, 'id'>): Promise<string> => {
  const locationRef = adminDb.collection('locations').doc()
  await locationRef.set(location)
  return locationRef.id
}

export const fetchLocation = async (locationId: string): Promise<Location | null> => {
  const snapshot = await adminDb.collection('locations').doc(locationId).get()
  const data = snapshot.data()
  if (!data) {
    return null
  }
  return { id: locationId, ...convertDate(data, dateColumns) } as Location
}

export const fetchLocationsByUser = async (userId: string): Promise<Location[]> => {
  const snapshot = await adminDb
    .collection('locations')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map((doc) => ({ id: doc.id, ...convertDate(doc.data(), dateColumns) }) as Location) as Location[]
}
