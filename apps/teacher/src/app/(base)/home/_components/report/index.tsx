'use client'

import Accordion from '@/ui/accordion'
import { Accordion as MantineAccordion } from '@mantine/core'
import styles from './styles.module.css'
import dayjs from '@/libs/dayjs'
import BaseButton from '@/ui/base-button'
import BaseTextarea from '@/ui/base-textarea'
import { useState } from 'react'
import { approveSubmission, rejectSubmission } from '../../actions'
import { useRouter } from 'next/navigation'

type Props = {
  items: {
    id: string
    name: string
    grade: number
    createdAt: string // 2025-07-28T00:00:00.000Z timestampやけど、stringで渡ってくる
    address: string
    phoneNumber: string
    club?: string
    // onlyMeals?: boolean
    meals: {
      startMeal: 'breakfast' | 'dinner'
      endMeal: 'breakfast' | 'dinner'
    }
    startDate: string
    endDate: string
    reason: string
    specialReason?: string
  }[]
}

export default function Report({ items }: Props) {
  const router = useRouter()
  const [comments, setComments] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleCommentChange = (itemId: string, value: string) => {
    setComments((prev) => ({ ...prev, [itemId]: value }))
  }

  const handleApprove = async (itemId: string) => {
    setLoading((prev) => ({ ...prev, [itemId]: true }))
    try {
      await approveSubmission(itemId)
      router.refresh()
    } catch (error) {
      console.error('Failed to approve submission:', error)
      alert('承認に失敗しました')
    } finally {
      setLoading((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const handleReject = async (itemId: string) => {
    const comment = comments[itemId] || ''
    if (!comment.trim()) {
      alert('差し戻し理由を入力してください')
      return
    }

    setLoading((prev) => ({ ...prev, [itemId]: true }))
    try {
      await rejectSubmission(itemId, comment)
      router.refresh()
    } catch (error) {
      console.error('Failed to reject submission:', error)
      alert('差し戻しに失敗しました')
    } finally {
      setLoading((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const listItems = items.map((item) => {
    return (
      <MantineAccordion.Item value={item.id} key={item.id}>
        <MantineAccordion.Control>
          <div className={styles.item}>
            <div className={styles.info}>
              <div className={styles.grade}>{item.grade}年</div>
              <div className={styles.name}>{item.name}</div>
              {item.club && <div className={styles.club}>[{item.club}]</div>}
            </div>

            <p className={styles.date}>申請日: {dayjs(item.createdAt).format('YYYY/MM/DD')}</p>
          </div>
        </MantineAccordion.Control>

        <MantineAccordion.Panel>
          <div className={styles.panel}>
            {/* 文字 */}
            <div className={styles.text}>
              {/* // TODO いらないかもしれない
                // 欠食届のみの場合 */}
              {/* <>
                  <p className={styles.textItem}>
                    申請種別: <span className={styles.value}>欠食届のみ</span>
                  </p>
                  <p className={styles.textItem}>
                    欠食期間:{' '}
                    <span className={styles.value}>
                      {dayjs(item.startDate).format('YYYY年M月D日 朝?')} 〜{' '}
                      {dayjs(item.endDate).format('YYYY年M月D日 夕?')} まで
                    </span>
                  </p>
                  <p className={styles.textItem}>
                    欠食理由: <span className={styles.value}>{item.reason}</span>
                  </p>
                </> */}
              {/*  欠食・帰省届の場合 */}
              <>
                <p className={styles.textItem}>
                  申請種別: <span className={styles.value}>欠食・帰省届</span>
                </p>
                <p className={styles.textItem}>
                  帰省期間:{' '}
                  <span className={styles.value}>
                    {dayjs(item.startDate).format('YYYY年M月D日 H:mm')} 〜{' '}
                    {dayjs(item.endDate).format('YYYY年M月D日 H:mm')}
                  </span>
                </p>
                <p className={styles.textItem}>
                  欠食期間:{' '}
                  <span className={styles.value}>
                    {dayjs(item.startDate).format('YYYY年M月D日')} {item.meals.startMeal === 'breakfast' ? '朝' : '夕'}{' '}
                    〜 {dayjs(item.endDate).format('YYYY年M月D日')} {item.meals.endMeal === 'breakfast' ? '朝' : '夕'}{' '}
                    まで
                  </span>
                </p>
                <div className={styles.row}>
                  <p className={styles.textItem}>
                    帰省先: <span className={styles.value}>{item.address}</span>
                  </p>
                  <p className={styles.textItem}>
                    電話番号: <span className={styles.value}>{item.phoneNumber}</span>
                  </p>
                </div>
                <p className={styles.textItem}>
                  帰省理由: <span className={styles.value}>{item.reason}</span>
                </p>
                {item.specialReason && (
                  <p className={`${styles.textItem} ${styles.specialReason}`}>
                    特別な事情: <span className={styles.value}>{item.specialReason}</span>
                  </p>
                )}
              </>
            </div>

            {/* コメント */}
            <div className={styles.commentArea}>
              <BaseTextarea
                label="コメント(差し戻す場合は必須)"
                value={comments[item.id] || ''}
                onChange={(value) => handleCommentChange(item.id, value)}
                placeholder="コメントを入力してください"
              />
              <div className={styles.buttonArea}>
                <BaseButton
                  onClick={() => handleReject(item.id)}
                  variant="secondary"
                  width="100px"
                  idDisabled={loading[item.id]}
                >
                  差し戻す
                </BaseButton>
                <BaseButton
                  onClick={() => handleApprove(item.id)}
                  variant="primary"
                  width="100px"
                  idDisabled={loading[item.id]}
                >
                  承認する
                </BaseButton>
              </div>
            </div>
          </div>
        </MantineAccordion.Panel>
      </MantineAccordion.Item>
    )
  })

  return (
    <div className={styles.container}>
      <Accordion>{listItems}</Accordion>
    </div>
  )
}
