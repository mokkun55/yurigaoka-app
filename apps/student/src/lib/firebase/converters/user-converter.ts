import type { User, UserData } from '@yurigaoka-app/common'
import * as admin from 'firebase-admin'

export const userConverter = {
  // Firestoreに保存するデータ形式に変換
  toFirestore: (user: UserData) => {
    return {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      isDeleted: user.isDeleted,
      grade: user.grade,
      class: user.class,
      club: user.club,
      roomNumber: user.roomNumber,
      phoneNumber: user.phoneNumber,
      locations: user.locations,
    }
  },

  // Firestoreからデータ形式に変換
  fromFirestore: (snapshot: admin.firestore.QueryDocumentSnapshot) => {
    const data = snapshot.data()
    return {
      id: snapshot.id, // idはdocumentのidを使う
      email: data.email,
      name: data.name,
      createdAt: data.createdAt,
      isDeleted: data.isDeleted,
      grade: data.grade,
      class: data.class,
      club: data.club,
      roomNumber: data.roomNumber,
      phoneNumber: data.phoneNumber,
      locations: data.locations,
    } as User
  },

  // QuerySnapshotからデータ形式に変換
  fromQuerySnapshot: (querySnapshot: admin.firestore.QuerySnapshot) => {
    return querySnapshot.docs.map((doc) => userConverter.fromFirestore(doc))
  },
}
