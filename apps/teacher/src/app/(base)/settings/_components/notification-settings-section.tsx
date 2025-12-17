'use client'

import styles from '../styles.module.css'

type Props = {
  notificationRecipientEmail: string
  submissionAcceptanceHours: {
    start: string
    end: string
  }
  onNotificationRecipientEmailChange: (_email: string) => void
  onSubmissionAcceptanceHoursChange: (_hours: { start: string; end: string }) => void
}

export function NotificationSettingsSection({
  notificationRecipientEmail,
  submissionAcceptanceHours,
  onNotificationRecipientEmailChange,
  onSubmissionAcceptanceHoursChange,
}: Props) {
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNotificationRecipientEmailChange(e.target.value)
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSubmissionAcceptanceHoursChange({ ...submissionAcceptanceHours, start: e.target.value })
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSubmissionAcceptanceHoursChange({ ...submissionAcceptanceHours, end: e.target.value })
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>通知・受付設定</h2>
      <p className={styles.sectionDescription}>メール通知先と申請受付時間を設定します。</p>

      <div className={styles.settingItem}>
        <label className={styles.settingItemLabel}>メール通知先アドレス</label>
        <p className={styles.settingItemDescription}>届出提出時に通知を送信するメールアドレス</p>
        <div className={styles.settingItemInput}>
          <input
            type="email"
            value={notificationRecipientEmail}
            onChange={handleEmailChange}
            placeholder="example@example.com"
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '8px',
              border: '1px solid var(--border-gray)',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>
      </div>

      <div className={styles.settingItemRow}>
        <div className={styles.settingItem}>
          <label className={styles.settingItemLabel}>申請受付開始時刻（平日）</label>
          <p className={styles.settingItemDescription}>平日の申請受付を開始する時刻</p>
          <div className={styles.settingItemInput}>
            <input
              type="time"
              value={submissionAcceptanceHours.start}
              onChange={handleStartTimeChange}
              className={styles.timeInput}
            />
          </div>
        </div>

        <div className={styles.settingItem}>
          <label className={styles.settingItemLabel}>申請受付終了時刻（平日）</label>
          <p className={styles.settingItemDescription}>平日の申請受付を終了する時刻</p>
          <div className={styles.settingItemInput}>
            <input
              type="time"
              value={submissionAcceptanceHours.end}
              onChange={handleEndTimeChange}
              className={styles.timeInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
