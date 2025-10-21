import type { TeacherWhitelist, TeacherWhitelistData } from '@yurigaoka-app/common'
import * as admin from 'firebase-admin'

export const teacherWhitelistConverter = {
  toFirestore: (teacherWhitelist: TeacherWhitelistData) => {
    return {
      email: teacherWhitelist.email,
      role: teacherWhitelist.role,
    }
  },
  fromFirestore: (snapshot: admin.firestore.QueryDocumentSnapshot) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      email: data.email,
      role: data.role,
    } as TeacherWhitelist
  },

  fromQuerySnapshot: (querySnapshot: admin.firestore.QuerySnapshot) => {
    return querySnapshot.docs.map((doc) => teacherWhitelistConverter.fromFirestore(doc))
  },
}
