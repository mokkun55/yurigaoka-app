/**
 * ユーザーの役割
 */
export type UserRole = 'student' | 'teacher' | 'admin'

/**
 * ユーザーの基本情報
 * Firestore: users コレクション
 */
export interface UserInfo {
  /** ユーザーID (Firebase Auth UID) */
  uid: string
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string | null
  /** 表示名（Firebase Auth） */
  displayName?: string | null
  /** 役割 */
  role: UserRole
  /** 削除フラグ */
  is_deleted?: boolean
  /** 作成日時 */
  created_at?: {
    type: string
    seconds: number
    nanoseconds: number
  }
  /** 登録完了フラグ */
  is_registered?: boolean
}
