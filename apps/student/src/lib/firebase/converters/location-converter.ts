import type { Location, LocationData } from '@yurigaoka-app/common'
import * as admin from 'firebase-admin'

export const locationConverter = {
  // Firestoreに保存するデータ形式に変換 (Date → Timestamp)
  toFirestore: (location: Location): LocationData => {
    return {
      name: location.name,
      address: location.address,
      createdAt: admin.firestore.Timestamp.fromDate(location.createdAt),
    }
  },

  // Firestoreからデータ形式に変換 (Timestamp → Date)
  fromFirestore: (data: LocationData, id: string): Location => {
    return {
      id,
      name: data.name,
      address: data.address,
      createdAt: data.createdAt.toDate(),
    }
  },
}
