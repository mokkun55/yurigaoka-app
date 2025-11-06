'use client'

import { toast } from 'react-hot-toast'
import styles from './styles.module.css'
import { useState, useTransition, useEffect } from 'react'
import CodeCard from './_components/code-card'
import { BaseSelect } from '@/ui/base-select'
import BaseButton from '@/ui/base-button'
import { getAllInviteCodes, createNewInviteCode, removeInviteCode } from './actions'
import { InviteCode } from '@yurigaoka-app/common'

export default function CodePage() {
  const [validityPeriod, setValidityPeriod] = useState<'1日' | '3日' | '7日'>('1日')
  const [codes, setCodes] = useState<InviteCode[]>([])
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  // 招待コード一覧を取得
  useEffect(() => {
    const loadCodes = async () => {
      try {
        const fetchedCodes = await getAllInviteCodes()
        setCodes(fetchedCodes)
      } catch (error) {
        console.error('Failed to load invite codes:', error)
        toast.error('招待コードの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    loadCodes()
  }, [])

  const handleGenerateCode = () => {
    if (!validityPeriod) {
      toast.error('有効期限を選択してください')
      return
    }

    startTransition(async () => {
      try {
        const result = await createNewInviteCode(validityPeriod)
        toast.success('招待コード「' + result.code + '」の発行に成功しました')

        // 一覧を再取得
        const fetchedCodes = await getAllInviteCodes()
        setCodes(fetchedCodes)
      } catch (e) {
        console.error(e)
        toast.error('招待コードの発行に失敗しました')
      }
    })
  }

  const handleDeleteCode = async (codeId: string) => {
    try {
      await removeInviteCode(codeId)
      toast.success('招待コードを削除しました')

      // 一覧を再取得
      const fetchedCodes = await getAllInviteCodes()
      setCodes(fetchedCodes)
    } catch (error) {
      console.error('Failed to delete invite code:', error)
      toast.error('招待コードの削除に失敗しました')
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
          <BaseButton type="submit" idDisabled={!validityPeriod || isPending}>
            {isPending ? '発行中...' : '発行する'}
          </BaseButton>
        </form>
      </div>

      {/* 右側 */}
      <div className={styles.rightSection}>
        <h1 className={styles.title}>有効な招待コード一覧</h1>
        {isLoading ? (
          <div>読み込み中...</div>
        ) : codes.length === 0 ? (
          <div>有効な招待コードはありません</div>
        ) : (
          <div className={styles.codeList}>
            {codes.map((code) => (
              <CodeCard
                key={code.id}
                code={code.code}
                usageCount={code.useCount}
                limitDate={code.limitDate}
                onDelete={() => handleDeleteCode(code.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
