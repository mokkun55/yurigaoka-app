import type { InviteCode, InviteCodeData } from '@yurigaoka-app/common'
import * as admin from 'firebase-admin'

export const inviteCodeConverter = {
  toFirestore: (inviteCode: InviteCodeData) => {
    return {
      code: inviteCode.code,
      useCount: inviteCode.useCount,
      createdAt: inviteCode.createdAt,
      limitDate: inviteCode.limitDate,
    }
  },
  fromFirestore: (snapshot: admin.firestore.QueryDocumentSnapshot) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      code: data.code,
      useCount: data.useCount,
      createdAt: data.createdAt.toDate(),
      limitDate: data.limitDate,
    } as InviteCode
  },

  fromQuerySnapshot: (querySnapshot: admin.firestore.QuerySnapshot) => {
    return querySnapshot.docs.map((doc) => inviteCodeConverter.fromFirestore(doc))
  },
}
