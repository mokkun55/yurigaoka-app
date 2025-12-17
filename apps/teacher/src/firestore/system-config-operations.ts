import type { SystemConfig } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'

/**
 * Firestoreからシステム設定を取得
 * @throws {Error} 設定が存在しない場合
 */
export async function getSystemConfig(): Promise<SystemConfig> {
  const [
    submissionDeadlineDaysDoc,
    clubOptionsDoc,
    curfewTimeDoc,
    rollCallTimeDoc,
    notificationRecipientEmailDoc,
    submissionAcceptanceHoursDoc,
  ] = await Promise.all([
    adminDb.collection('systemConfig').doc('submissionDeadlineDays').get(),
    adminDb.collection('systemConfig').doc('clubOptions').get(),
    adminDb.collection('systemConfig').doc('curfewTime').get(),
    adminDb.collection('systemConfig').doc('rollCallTime').get(),
    adminDb.collection('systemConfig').doc('notificationRecipientEmail').get(),
    adminDb.collection('systemConfig').doc('submissionAcceptanceHours').get(),
  ])

  if (!submissionDeadlineDaysDoc.exists) {
    throw new Error('システム設定「提出期限設定」が見つかりません。管理画面で設定してください。')
  }

  if (!clubOptionsDoc.exists) {
    throw new Error('システム設定「部活動の選択肢」が見つかりません。管理画面で設定してください。')
  }

  if (!curfewTimeDoc.exists) {
    throw new Error('システム設定「門限時刻設定」が見つかりません。管理画面で設定してください。')
  }

  if (!rollCallTimeDoc.exists) {
    throw new Error('システム設定「点呼時刻設定」が見つかりません。管理画面で設定してください。')
  }

  if (!notificationRecipientEmailDoc.exists) {
    throw new Error('システム設定「メール通知先アドレス」が見つかりません。管理画面で設定してください。')
  }

  if (!submissionAcceptanceHoursDoc.exists) {
    throw new Error('システム設定「申請受付時間」が見つかりません。管理画面で設定してください。')
  }

  const submissionDeadlineDays = submissionDeadlineDaysDoc.data() as { homecoming: number; mealAbsence: number }
  const clubOptions = (clubOptionsDoc.data() as { options: string[] }).options
  const curfewTime = curfewTimeDoc.data() as { morning: string; night: string }
  const rollCallTime = rollCallTimeDoc.data() as { morning: string; morningAlt: string; evening: string }
  const notificationRecipientEmail = (notificationRecipientEmailDoc.data() as { email: string }).email
  const submissionAcceptanceHours = submissionAcceptanceHoursDoc.data() as { start: string; end: string }

  return {
    submissionDeadlineDays,
    clubOptions,
    curfewTime,
    rollCallTime,
    notificationRecipientEmail,
    submissionAcceptanceHours,
  }
}

/**
 * Firestoreにシステム設定を保存
 */
export async function updateSystemConfig(config: SystemConfig): Promise<void> {
  await Promise.all([
    adminDb.collection('systemConfig').doc('submissionDeadlineDays').set(config.submissionDeadlineDays),
    adminDb.collection('systemConfig').doc('clubOptions').set({ options: config.clubOptions }),
    adminDb.collection('systemConfig').doc('curfewTime').set(config.curfewTime),
    adminDb.collection('systemConfig').doc('rollCallTime').set(config.rollCallTime),
    adminDb
      .collection('systemConfig')
      .doc('notificationRecipientEmail')
      .set({ email: config.notificationRecipientEmail }),
    adminDb.collection('systemConfig').doc('submissionAcceptanceHours').set(config.submissionAcceptanceHours),
  ])
}
