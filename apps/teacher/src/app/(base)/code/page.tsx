// cspell:ignore ASASDFG GSAS32A PO876BG
'use client'

import { toast } from 'react-hot-toast'
import styles from './styles.module.css'
import { useState } from 'react'
import CodeCard from './_components/code-card'
import { BaseSelect } from '@/ui/base-select'
import BaseButton from '@/ui/base-button'

// TODO モックなので後で動的に取得
// disable
const codeList = ['ASASDFG', 'GSAS32A', 'PO876BG']

export default function CodePage() {
  const [validityPeriod, setValidityPeriod] = useState<'1日' | '3日' | '7日'>('1日')

  const handleGenerateCode = () => {
    if (!validityPeriod) {
      toast.error('有効期限を選択してください')
      return
    }
    try {
      console.log('generate code')
      toast.success('招待コードの発行に成功しました')
    } catch (e) {
      console.error(e)
      toast.error('招待コードの発行に失敗しました')
    }
  }
  return (
    <div className={styles.container}>
      {/* 左側 */}
      <div className={styles.leftSection}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleGenerateCode()
          }}
          className={styles.form}
        >
          <h1 className={styles.title}>新しい招待コードを発行</h1>
          <BaseSelect
            label="有効期限"
            placeholder="期限を選択"
            data={['1日', '3日', '7日']}
            width="100%"
            value={validityPeriod}
            onChange={(value: string) => setValidityPeriod(value as '1日' | '3日' | '7日')}
          />
          <BaseButton type="submit" idDisabled={!validityPeriod}>
            発行する
          </BaseButton>
        </form>
      </div>

      {/* 右側 */}
      <div className={styles.rightSection}>
        {/* TODO 無効な招待コードは表示するか否か */}
        {/* とりあえず今は有効なコードのみ表示 */}
        <h1 className={styles.title}>有効な招待コード一覧</h1>
        <div className={styles.codeList}>
          {codeList.map((code) => (
            <CodeCard key={code} code={code} usageCount={0} limitDate={new Date()} />
          ))}
        </div>
      </div>
    </div>
  )
}
