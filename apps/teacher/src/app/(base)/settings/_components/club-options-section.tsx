'use client'

import { useState } from 'react'
import BaseButton from '@/ui/base-button'
import styles from '../styles.module.css'

type Props = {
  options: string[]
  onChange: (_options: string[]) => void
}

export function ClubOptionsSection({ options, onChange }: Props) {
  const [newOption, setNewOption] = useState('')

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      onChange([...options, newOption.trim()])
      setNewOption('')
    }
  }

  const handleRemoveOption = (optionToRemove: string) => {
    // "none"（未選択）は削除できない
    if (optionToRemove === 'none') {
      return
    }
    onChange(options.filter((opt) => opt !== optionToRemove))
  }

  // "none" を除いた部活動一覧を表示
  const displayOptions = options.filter((opt) => opt !== 'none')

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddOption()
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>部活動の選択肢</h2>
      <p className={styles.sectionDescription}>ユーザー登録時に選択できる部活動のリストを管理します。</p>

      <div className={styles.settingItem}>
        <label className={styles.settingItemLabel}>部活動一覧</label>
        <p className={styles.settingItemDescription}>現在登録されている部活動の選択肢</p>

        <div className={styles.clubList}>
          {displayOptions.map((option, index) => (
            <div key={index} className={styles.clubItem}>
              <span className={styles.clubItemName}>{option}</span>
              <BaseButton
                onClick={() => handleRemoveOption(option)}
                variant="danger"
                width="auto"
                height="40px"
                type="button"
              >
                削除
              </BaseButton>
            </div>
          ))}
        </div>

        <div className={styles.addClubForm}>
          <div style={{ flex: 1, maxWidth: '300px' }}>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="新しい部活動名を入力"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid var(--border-gray)',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <BaseButton onClick={handleAddOption} width="auto" height="40px" type="button">
            追加
          </BaseButton>
        </div>
      </div>
    </div>
  )
}
