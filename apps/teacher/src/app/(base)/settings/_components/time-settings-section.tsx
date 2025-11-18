'use client'

import styles from '../styles.module.css'

type Props = {
  rollCallTime: {
    morning: string
    morningAlt: string
    evening: string
  }
  onRollCallTimeChange: (_time: { morning: string; morningAlt: string; evening: string }) => void
}

export function TimeSettingsSection({ rollCallTime, onRollCallTimeChange }: Props) {
  const handleRollCallMorningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRollCallTimeChange({ ...rollCallTime, morning: e.target.value })
  }

  const handleRollCallEveningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRollCallTimeChange({ ...rollCallTime, evening: e.target.value })
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>点呼時刻設定</h2>
      <p className={styles.sectionDescription}>点呼時刻を設定します。</p>

      <div className={styles.settingItemRow}>
        <div className={styles.settingItem}>
          <label className={styles.settingItemLabel}>朝の点呼時刻</label>
          <div className={styles.settingItemInput}>
            <input
              type="time"
              value={rollCallTime.morning}
              onChange={handleRollCallMorningChange}
              className={styles.timeInput}
            />
          </div>
        </div>

        <div className={styles.settingItem}>
          <label className={styles.settingItemLabel}>夜の点呼時刻</label>
          <div className={styles.settingItemInput}>
            <input
              type="time"
              value={rollCallTime.evening}
              onChange={handleRollCallEveningChange}
              className={styles.timeInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
