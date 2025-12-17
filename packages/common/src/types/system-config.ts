/**
 * システム設定の型定義
 */

/**
 * 提出期限設定
 */
export type SubmissionDeadlineDays = {
  /** 帰省届の提出期限（日数） */
  homecoming: number
  /** 欠食届の提出期限（日数） */
  mealAbsence: number
}

/**
 * 門限時刻設定
 */
export type CurfewTime = {
  /** 朝の門限時刻（HH:mm形式） */
  morning: string
  /** 夜の門限時刻（HH:mm形式） */
  night: string
}

/**
 * 点呼時刻設定
 */
export type RollCallTime = {
  /** 朝の点呼時刻（HH:mm形式） */
  morning: string
  /** 朝の点呼時刻（別バージョン、HH:mm形式） */
  morningAlt: string
  /** 夜の点呼時刻（HH:mm形式） */
  evening: string
}

/**
 * 申請受付時間設定（平日）
 */
export type SubmissionAcceptanceHours = {
  /** 開始時刻（HH:mm形式） */
  start: string
  /** 終了時刻（HH:mm形式） */
  end: string
}

/**
 * システム設定全体
 */
export type SystemConfig = {
  /** 提出期限設定 */
  submissionDeadlineDays: SubmissionDeadlineDays
  /** 部活動の選択肢 */
  clubOptions: string[]
  /** 門限時刻設定 */
  curfewTime: CurfewTime
  /** 点呼時刻設定 */
  rollCallTime: RollCallTime
  /** メール通知先アドレス */
  notificationRecipientEmail: string
  /** 申請受付時間設定（平日） */
  submissionAcceptanceHours: SubmissionAcceptanceHours
}
