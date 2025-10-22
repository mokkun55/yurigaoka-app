import type { User, UserData, LocationData } from '@yurigaoka-app/common'
import * as admin from 'firebase-admin'
import { locationConverter } from './location-converter'

export const userConverter = {
  // Firestoreに保存するデータ形式に変換 (User → UserData: Date → Timestamp)
  toFirestore: (user: User): UserData => {
    return {
      email: user.email,
      name: user.name,
      createdAt: admin.firestore.Timestamp.fromDate(user.createdAt),
      isDeleted: user.isDeleted,
      grade: user.grade,
      class: user.class,
      club: user.club,
      roomNumber: user.roomNumber,
      phoneNumber: user.phoneNumber,
      locations: user.locations?.map((loc) => locationConverter.toFirestore(loc)),
    }
  },

  // Firestoreからデータ形式に変換 (UserData → User: Timestamp → Date)
  fromFirestore: (snapshot: admin.firestore.QueryDocumentSnapshot) => {
    const data = snapshot.data()
    if (!data) {
      return null
    }
    return {
      id: snapshot.id, // idはdocumentのidを使う
      email: data.email,
      name: data.name,
      createdAt: data.createdAt.toDate(),
      isDeleted: data.isDeleted,
      grade: data.grade,
      class: data.class,
      club: data.club,
      roomNumber: data.roomNumber,
      phoneNumber: data.phoneNumber,
      locations: data.locations?.map((loc: LocationData, index: number) =>
        locationConverter.fromFirestore(loc, `${snapshot.id}_location_${index}`)
      ),
    } as User
  },

  // DocumentSnapshotからデータ形式に変換 (UserData → User: Timestamp → Date)
  fromDocumentSnapshot: (snapshot: admin.firestore.DocumentSnapshot): User | null => {
    if (!snapshot.exists) {
      return null
    }
    const data = snapshot.data()
    if (!data) {
      return null
    }
    return {
      id: snapshot.id,
      email: data.email,
      name: data.name,
      createdAt: data.createdAt.toDate(),
      isDeleted: data.isDeleted,
      grade: data.grade,
      class: data.class,
      club: data.club,
      roomNumber: data.roomNumber,
      phoneNumber: data.phoneNumber,
      locations: data.locations?.map((loc: LocationData, index: number) =>
        locationConverter.fromFirestore(loc, `${snapshot.id}_location_${index}`)
      ),
    } as User
  },

  // QuerySnapshotからデータ形式に変換
  fromQuerySnapshot: (querySnapshot: admin.firestore.QuerySnapshot) => {
    return querySnapshot.docs.map((doc) => userConverter.fromFirestore(doc))
  },
}
