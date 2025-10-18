import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// Firebase Admin SDKの初期化
admin.initializeApp()

/**
 * メールアドレスに基づいてユーザーのロールを判定する
 * @param email - ユーザーのメールアドレス
 * @param db - Firestore データベースインスタンス
 * @returns ユーザーのロール（"student" | "teacher" | "manager"）
 */
async function determineUserRole(email: string, db: admin.firestore.Firestore): Promise<string> {
  // まずwhitelistを確認（学生の中にも寮長などの特別な役割がある可能性があるため）
  const whitelistSnapshot = await db.collection('teacherWhitelist').where('email', '==', email).get()

  if (!whitelistSnapshot.empty) {
    const whitelistDoc = whitelistSnapshot.docs[0]
    const role = whitelistDoc.data().role
    return role || 'teacher' // roleが未定義の場合はteacherをデフォルトとする
  }

  // whitelistにない場合、学生メールアドレスのパターンをチェック: gXXXXX@ktc.ac.jp
  const studentEmailPattern = /^g\d{5}@ktc\.ac\.jp$/i

  if (studentEmailPattern.test(email)) {
    return 'student'
  }

  // どちらにも該当しない場合はエラーをスロー
  throw new Error(`認証されていないメールアドレス: ${email}`)
}

/**
 * 新しいユーザーが作成されたときに自動的にFirestoreにユーザードキュメントを作成する
 * Authentication onCreate トリガー
 */
export const createUserDocument = functions
  .region('asia-northeast1') // 東京リージョン
  .auth.user()
  .onCreate(async (user) => {
    try {
      const uid = user.uid
      const email = user.email
      const displayName = user.displayName || ''

      // メールアドレスが存在しない場合はエラー
      if (!email) {
        console.error('ユーザーのメールアドレスが存在しません:', uid)
        return
      }

      const db = admin.firestore()
      const userDocRef = db.collection('users').doc(uid)

      // ユーザードキュメントが既に存在するかチェック
      const userDoc = await userDocRef.get()
      if (userDoc.exists) {
        console.log('ユーザードキュメントが既に存在します:', uid)
        return
      }

      // メールアドレスに基づいてロールを判定
      let role: string
      try {
        role = await determineUserRole(email, db)
      } catch (error) {
        // 未承認のメールアドレスの場合はログに記録して処理を終了
        console.warn('認証されていないメールアドレスが検出されました:', email, 'エラー:', error)
        return
      }

      // ユーザードキュメントの基本データ
      const baseUserData = {
        email: email,
        role: role,
        name: displayName,
        createdAt: FieldValue.serverTimestamp(),
        isDeleted: false,
      }

      // 学生と寮長の場合は追加フィールドを含める
      const userData =
        role === 'student' || role === 'manager'
          ? {
              ...baseUserData,
              isRegistered: false,
            }
          : baseUserData

      await userDocRef.set(userData)

      console.log('ユーザードキュメントの作成に成功しました:', uid, 'ロール:', role)
    } catch (error) {
      console.error('ユーザードキュメントの作成に失敗しました:', error)
      // Firestore操作などの予期しないエラーの場合のみ再スロー
      throw error
    }
  })
