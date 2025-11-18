import type { SystemConfig } from '@yurigaoka-app/common'
import { adminDb } from '@/lib/firebase/admin'

/**
 * Firestoreからシステム設定を取得
 */
export async function getSystemConfig(): Promise<SystemConfig> {
  const [submissionDeadlineDaysDoc, clubOptionsDoc, curfewTimeDoc, rollCallTimeDoc] = await Promise.all([
    adminDb.collection('systemConfig').doc('submissionDeadlineDays').get(),
    adminDb.collection('systemConfig').doc('clubOptions').get(),
    adminDb.collection('systemConfig').doc('curfewTime').get(),
    adminDb.collection('systemConfig').doc('rollCallTime').get(),
  ])

  const submissionDeadlineDays = submissionDeadlineDaysDoc.exists
    ? (submissionDeadlineDaysDoc.data() as { homecoming: number; mealAbsence: number })
    : { homecoming: 3, mealAbsence: 3 }

  const clubOptions = clubOptionsDoc.exists
    ? (clubOptionsDoc.data() as { options: string[] }).options
    : ['ソフトテニス部', 'サッカー部', 'none']

  const curfewTime = curfewTimeDoc.exists
    ? (curfewTimeDoc.data() as { morning: string; night: string })
    : { morning: '07:39', night: '20:29' }

  const rollCallTime = rollCallTimeDoc.exists
    ? (rollCallTimeDoc.data() as { morning: string; morningAlt: string; evening: string })
    : { morning: '07:30', morningAlt: '07:40', evening: '20:30' }

  return {
    submissionDeadlineDays,
    clubOptions,
    curfewTime,
    rollCallTime,
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
  ])
}
