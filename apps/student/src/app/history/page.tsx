'use client'

import HomeHistoryCard from './_components/history-card/HomeHistoryCard'
import MealHistoryCard from './_components/history-card/MealHistoryCard'
import Link from 'next/link'
import type { Submission } from '@yurigaoka-app/common'
import { getUserSubmissions } from './actions'
import { useFirebaseAuthContext } from '@/providers/AuthProvider'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/_components/ui/loading-spinner'

export default function HistoryPage() {
  const { uid } = useFirebaseAuthContext()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!uid) return

      try {
        setLoading(true)
        const data = await getUserSubmissions(uid)
        setSubmissions(data)
      } catch (err) {
        console.error('申請履歴の取得に失敗しました:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [uid])

  if (loading) {
    return (
      <div className="p-3 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <div className="p-3 text-center">{error}</div>
  }
  return (
    <div className="p-3 flex flex-col flex-grow overflow-y-auto">
      <p className="text-center text-sm">申請履歴をクリックで詳細を見ることができます</p>
      <div className="mt-3 flex flex-col gap-4 overflow-y-auto flex-grow">
        {submissions.length === 0 ? (
          <div className="text-center text-(--sub-text)">申請履歴がありません</div>
        ) : (
          submissions.map((submission) => {
            const status = submission.status

            // mealsOffからmeal情報を変換
            const meal = {
              startDate: {
                morning: submission.mealsOff[0]?.breakfast || false,
                evening: submission.mealsOff[0]?.dinner || false,
              },
              endDate: {
                morning: submission.mealsOff[submission.mealsOff.length - 1]?.breakfast || false,
                evening: submission.mealsOff[submission.mealsOff.length - 1]?.dinner || false,
              },
            }

            if (submission.type === '帰省') {
              // 帰省届 & 欠食届
              const homecomingSubmission = submission as import('@yurigaoka-app/common').HomecomingSubmission
              return (
                <Link href={`/history/${submission.id}`} key={submission.id} className="block">
                  <HomeHistoryCard
                    status={status}
                    createdAt={submission.createdAt}
                    period={{
                      startDate: homecomingSubmission.startDate,
                      endDate: homecomingSubmission.endDate,
                    }}
                    meal={meal}
                  />
                </Link>
              )
            } else {
              // 欠食届
              return (
                <Link href={`/history/${submission.id}`} key={submission.id} className="block">
                  <MealHistoryCard
                    status={status}
                    createdAt={submission.createdAt}
                    period={{
                      startDate: submission.mealsOff[0]?.date,
                      endDate: submission.mealsOff[submission.mealsOff.length - 1]?.date,
                    }}
                    meal={meal}
                  />
                </Link>
              )
            }
          })
        )}
      </div>
    </div>
  )
}
