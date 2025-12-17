import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

function getSessionCookieName(): string {
  const cookieName = process.env.SESSION_COOKIE_NAME
  if (!cookieName) {
    throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
  }
  return cookieName
}

/**
 * サーバーサイドで現在のユーザーのロールを取得する
 * @returns ユーザーのロール（'teacher' | 'manager' | 'student'）または null（未認証の場合）
 */
export async function getUserRole(): Promise<'teacher' | 'manager' | 'student' | null> {
  try {
    const cookieName = getSessionCookieName()
    const sessionCookie = (await cookies()).get(cookieName)?.value

    if (!sessionCookie) {
      return null
    }

    // セッションCookieを検証
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)

    const uid = decodedClaims.uid
    if (!uid) {
      return null
    }

    // Firestoreからユーザー情報を取得
    const userDoc = await adminDb.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      return null
    }

    const userData = userDoc.data()
    const role = userData?.role || 'teacher'

    // roleが'teacher' | 'manager' | 'student'のいずれかであることを確認
    if (role === 'teacher' || role === 'manager' || role === 'student') {
      return role
    }

    return 'teacher' // デフォルトはteacher
  } catch (error) {
    console.error('Failed to get user role:', error)
    return null
  }
}
