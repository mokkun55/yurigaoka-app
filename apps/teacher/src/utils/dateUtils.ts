import type { DocumentData } from 'firebase-admin/firestore'
import type FirebaseFirestore from 'firebase-admin/firestore'

/**
 * firebase-adminのTimestamp型をDate型に変換する
 * @param timestamp Firestore Timestamp
 */
export function convertFirestoreTimestampToDate(timestamp: FirebaseFirestore.Timestamp): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  return timestamp as unknown as Date
}

/**
 * firestoreのsnapshotからtimestamp型をDate型に変換する
 * 学生側のconvert-date.tsと同様の処理を行う
 * @param snapshot Firestore DocumentData
 * @param targetKey 変換対象のキーの配列
 */
export function convertDate(snapshot: DocumentData, targetKey: Array<string>): DocumentData {
  targetKey.forEach((key) => {
    if (key.includes('.')) {
      // ネストされたプロパティの場合（例: locations.createdAt）
      const [parentKey, childKey] = key.split('.')
      const parentValue = snapshot[parentKey]

      if (Array.isArray(parentValue)) {
        // 配列の場合、各要素の子プロパティを変換
        parentValue.forEach((item: DocumentData) => {
          if (item && item[childKey]) {
            const timestamp = item[childKey] as FirebaseFirestore.Timestamp
            if (timestamp && timestamp.toDate) {
              item[childKey] = timestamp.toDate()
            }
          }
        })
      }
    } else {
      // 通常のプロパティの場合
      const value = snapshot[key] as FirebaseFirestore.Timestamp
      if (value && value.toDate) {
        snapshot[key] = value.toDate()
      }
    }
  })
  return snapshot
}
