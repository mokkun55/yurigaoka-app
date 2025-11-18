'use client'

import { NumberInput } from '@mantine/core'
import styles from '../styles.module.css'

type Props = {
  config: {
    homecoming: number
    mealAbsence: number
  }
  onChange: (_config: { homecoming: number; mealAbsence: number }) => void
}

export function SubmissionDeadlineSection({ config, onChange }: Props) {
  const handleHomecomingChange = (value: number | string) => {
    const numValue = typeof value === 'number' ? value : parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      onChange({ ...config, homecoming: numValue })
    }
  }

  const handleMealAbsenceChange = (value: number | string) => {
    const numValue = typeof value === 'number' ? value : parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      onChange({ ...config, mealAbsence: numValue })
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>提出期限設定</h2>
      <p className={styles.sectionDescription}>
        各届出の提出期限を設定します。開始日の何日前までに提出する必要があるかを指定してください。
      </p>

      <div className={styles.settingItemRow}>
        <div className={styles.settingItem}>
          <label className={styles.settingItemLabel}>帰省届の提出期限</label>
          <p className={styles.settingItemDescription}>帰省届は開始日の何日前までに提出する必要があるか（日数）</p>
          <div className={styles.settingItemInput}>
            <NumberInput
              value={config.homecoming}
              onChange={handleHomecomingChange}
              placeholder="3"
              min={0}
              allowDecimal={false}
            />
          </div>
        </div>

        <div className={styles.settingItem}>
          <label className={styles.settingItemLabel}>欠食届の提出期限</label>
          <p className={styles.settingItemDescription}>欠食届は開始日の何日前までに提出する必要があるか（日数）</p>
          <div className={styles.settingItemInput}>
            <NumberInput
              value={config.mealAbsence}
              onChange={handleMealAbsenceChange}
              placeholder="3"
              min={0}
              allowDecimal={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
