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
    if (!role) {
      throw new Error(`ロールが未定義です`)
    }
    return role
  }

  // whitelistにない場合、学生メールアドレスのパターンをチェック
  // 環境変数は関数実行時に取得
  const studentEmailPatternStr = process.env.STUDENT_EMAIL_PATTERN
  if (!studentEmailPatternStr) {
    throw new Error('環境変数 STUDENT_EMAIL_PATTERN が設定されていません')
  }
  const studentEmailPattern = new RegExp(studentEmailPatternStr, 'i')

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
        return
      }

      const db = admin.firestore()
      const userDocRef = db.collection('users').doc(uid)

      // ユーザードキュメントが既に存在するかチェック
      const userDoc = await userDocRef.get()
      if (userDoc.exists) {
        return
      }

      // メールアドレスに基づいてロールを判定
      let role: string
      try {
        role = await determineUserRole(email, db)
      } catch (error) {
        // 未承認のメールアドレスの場合はログに記録して処理を終了
        functions.logger.warn('認証されていないメールアドレスが検出されました:', email, 'エラー:', error)
        return
      }

      const userData = {
        email: email,
        name: displayName,
        createdAt: FieldValue.serverTimestamp(),
        isDeleted: false,
        role: role,
        isRegistered: role === 'teacher' ? true : false, // 教員以外は初回登録が必要
      }

      await userDocRef.set(userData)

      functions.logger.info('ユーザードキュメントの作成に成功しました:', uid, 'ロール:', role)
    } catch (error) {
      console.error('ユーザードキュメントの作成に失敗しました:', error)
      throw error
    }
  })
