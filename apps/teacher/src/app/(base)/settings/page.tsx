'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import BaseButton from '@/ui/base-button'
import styles from './styles.module.css'
import { SubmissionDeadlineSection } from './_components/submission-deadline-section'
import { ClubOptionsSection } from './_components/club-options-section'
import { TimeSettingsSection } from './_components/time-settings-section'
import { useAuth } from '@/hooks/useAuth'
import type { User } from 'firebase/auth'

// 設定の型定義
type SystemConfig = {
  submissionDeadlineDays: {
    homecoming: number
    mealAbsence: number
  }
  clubOptions: string[]
  curfewTime: {
    morning: string
    night: string
  }
  rollCallTime: {
    morning: string
    morningAlt: string
    evening: string
  }
}

// デフォルト値
const defaultConfig: SystemConfig = {
  submissionDeadlineDays: {
    homecoming: 3,
    mealAbsence: 3,
  },
  clubOptions: ['ソフトテニス部', 'サッカー部', 'none'],
  curfewTime: {
    morning: '07:39',
    night: '20:29',
  },
  rollCallTime: {
    morning: '07:30',
    morningAlt: '07:40',
    evening: '20:30',
  },
}

export default function SettingPage() {
  const { getUser, signOut } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [config, setConfig] = useState<SystemConfig>(defaultConfig)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      setUser(user)
    }
    fetchUser()

    // TODO: Firestoreから設定を読み込む
    // 現在はデフォルト値を使用
    setConfig(defaultConfig)
  }, [getUser])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Firestoreに設定を保存する
      await new Promise((resolve) => setTimeout(resolve, 500)) // 仮の保存処理
      toast.success('設定を保存しました')
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('設定の保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfigChange = (newConfig: Partial<SystemConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
    setHasChanges(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>設定</h1>
        <p>設定変更後はページ下部の「変更を保存」ボタンを押して保存してください。</p>
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

        {/* ユーザー情報セクション */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>ユーザー情報</h2>
          <div className={styles.userInfo}>
            <p>
              <strong>メールアドレス:</strong> {user?.email || '読み込み中...'}
            </p>
            <p>
              <strong>名前:</strong> {user?.displayName || '未設定'}
            </p>
            <div style={{ marginTop: '16px' }}>
              <BaseButton onClick={() => signOut()} variant="secondary">
                ログアウト
              </BaseButton>
            </div>
          </div>
        </div>

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
