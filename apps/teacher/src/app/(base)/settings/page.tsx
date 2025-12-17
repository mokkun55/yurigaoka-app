'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import BaseButton from '@/ui/base-button'
import styles from './styles.module.css'
import { SubmissionDeadlineSection } from './_components/submission-deadline-section'
import { ClubOptionsSection } from './_components/club-options-section'
import { TimeSettingsSection } from './_components/time-settings-section'
import { NotificationSettingsSection } from './_components/notification-settings-section'
import { useAuth } from '@/hooks/useAuth'
import type { SystemConfig } from '@yurigaoka-app/common'
import { fetchSystemConfig, saveSystemConfig } from './actions'

export default function SettingPage() {
  const { signOut } = useAuth()
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const configData = await fetchSystemConfig()
        if (isMounted) {
          setConfig(configData)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        if (isMounted) {
          toast.error('データの読み込みに失敗しました')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadData()

    return () => {
      isMounted = false
    }
  }, []) // マウント時のみ実行（getUserは毎回同じ関数を返すため依存配列から除外）

  const handleSave = async () => {
    if (!config) return

    setIsSaving(true)
    try {
      const configToSave: SystemConfig = {
        ...config,
        curfewTime: calculateCurfewTime(config.rollCallTime),
      }
      await saveSystemConfig(configToSave)
      toast.success('設定を保存しました')
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('設定の保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  // 点呼時刻から門限時刻を計算（1分前）
  const calculateCurfewTime = (rollCallTime: SystemConfig['rollCallTime']): SystemConfig['curfewTime'] => {
    const calculateOneMinuteBefore = (timeString: string): string => {
      const [hours, minutes] = timeString.split(':').map(Number)
      const date = new Date()
      date.setHours(hours, minutes - 1, 0, 0)
      const h = String(date.getHours()).padStart(2, '0')
      const m = String(date.getMinutes()).padStart(2, '0')
      return `${h}:${m}`
    }

    return {
      morning: calculateOneMinuteBefore(rollCallTime.morning),
      night: calculateOneMinuteBefore(rollCallTime.evening),
    }
  }

  const handleConfigChange = (newConfig: Partial<SystemConfig>) => {
    if (!config) return
    setConfig((prev) => {
      if (!prev) return null

      // rollCallTimeが変更された場合、curfewTimeも自動計算
      const updatedConfig = { ...prev, ...newConfig }
      if (newConfig.rollCallTime) {
        updatedConfig.curfewTime = calculateCurfewTime(updatedConfig.rollCallTime)
      }

      return updatedConfig
    })
    setHasChanges(true)
  }

  if (isLoading || !config) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>設定</h1>
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>設定</h1>
          <p>設定変更後はページ下部の「変更を保存」ボタンを押して保存してください。</p>
        </div>
        <div className={styles.headerRight}>
          <BaseButton onClick={() => signOut()} variant="danger">
            ログアウト
          </BaseButton>
        </div>
      </div>

      <div className={styles.content}>
        {/* 提出期限設定 */}
        <SubmissionDeadlineSection
          config={config.submissionDeadlineDays}
          onChange={(deadlines) => handleConfigChange({ submissionDeadlineDays: deadlines })}
        />

        {/* 部活動選択肢設定 */}
        <ClubOptionsSection
          options={config.clubOptions}
          onChange={(options) => handleConfigChange({ clubOptions: options })}
        />

        {/* 時刻設定 */}
        <TimeSettingsSection
          rollCallTime={config.rollCallTime}
          onRollCallTimeChange={(time) => handleConfigChange({ rollCallTime: time })}
        />

        {/* 通知・受付設定 */}
        <NotificationSettingsSection
          notificationRecipientEmail={config.notificationRecipientEmail}
          submissionAcceptanceHours={config.submissionAcceptanceHours}
          onNotificationRecipientEmailChange={(email) => handleConfigChange({ notificationRecipientEmail: email })}
          onSubmissionAcceptanceHoursChange={(hours) => handleConfigChange({ submissionAcceptanceHours: hours })}
        />

        <div>
          {hasChanges && (
            <BaseButton onClick={handleSave} idDisabled={isSaving} variant="primary">
              {isSaving ? '保存中...' : '変更を保存'}
            </BaseButton>
          )}
        </div>
      </div>
    </div>
  )
}
