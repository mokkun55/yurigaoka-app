import type { DocumentData, Timestamp } from 'firebase/firestore'
/**
 * firebaseのtimestamp型をDate型に変換する
 * @param snapshot
 * @param targetKey
 */
export function convertDate(snapshot: DocumentData, targetKey: Array<string>): DocumentData {
  targetKey.forEach((key) => {
    if (key.includes('.')) {
      // ネストされたプロパティの場合（例: locations.createdAt）
      const [parentKey, childKey] = key.split('.')
      const parentValue = snapshot[parentKey]

      if (Array.isArray(parentValue)) {
        // 配列の場合、各要素の子プロパティを変換
        parentValue.forEach((item) => {
          if (item && item[childKey]) {
            const timestamp = item[childKey]
            if (timestamp && timestamp.toDate) {
              item[childKey] = timestamp.toDate()
            }
          }
        })
      }
    } else {
      // 通常のプロパティの場合
      const value: Timestamp = snapshot[key]
      if (value && value.toDate) {
        snapshot[key] = value.toDate()
      }
    }
  })
  return snapshot
}
