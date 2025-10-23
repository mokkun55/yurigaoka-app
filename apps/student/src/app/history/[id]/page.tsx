'use client'

// TODO ヘッダーを申請詳細にする

import { CalendarIcon, ForkKnife, HomeIcon } from 'lucide-react'
import Badge from '../_components/badge'
import dayjs from 'dayjs'
import TextLabel from '@/_components/ui/text-label'
import type { Submission, Location } from '@yurigaoka-app/common'
import { getSubmissionById, getLocationById } from '../actions'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/_components/ui/loading-spinner'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default function HistoryDetailPage({ params }: Props) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await getSubmissionById(id)
        if (!data) {
          setError('申請が見つかりません')
          return
        }
        setSubmission(data)

        // 帰省申請の場合、location情報も取得
        if (data.type === '帰省') {
          const homecomingSubmission = data as import('@yurigaoka-app/common').HomecomingSubmission
          const locationData = await getLocationById(homecomingSubmission.locationId)
          setLocation(locationData)
        }
      } catch (err) {
        console.error('申請詳細の取得に失敗しました:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmission()
  }, [id])

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

  if (!submission) {
    return <div className="p-3 text-center">申請が見つかりません</div>
  }

  return (
    <div className="p-3 flex flex-col flex-grow overflow-y-auto gap-4">
      <Badge type={submission.status} size="big" className="w-fit mx-auto" />

      <div className="flex flex-col gap-4 bg-white rounded-md p-4 border border-(--border-gray)">
        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-(--sub-text)">
            <CalendarIcon className="w-4 h-4" />
            <p>申請日</p>
          </div>
          <p className="text-(--main-text)">{dayjs(submission.createdAt).format('YYYY年MM月DD日')}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-(--sub-text)">
            <CalendarIcon className="w-4 h-4" />
            <p>申請種別</p>
          </div>
          <p className="text-(--main-text)">{submission.type === '帰省' ? '帰省・欠食届' : '欠食届'}</p>
        </div>
      </div>

      {/* 帰省情報 */}
      {submission.type === '帰省' && (
        <div className="flex flex-col gap-4 bg-white rounded-md p-4 border border-(--border-gray)">
          <div className="flex items-center gap-1">
            <HomeIcon className="w-4 h-4 text-(--main-blue)" />
            <p className="text-(--main-text) font-bold">帰省情報</p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <TextLabel label="帰省期間" />
              <p className="text-(--main-text)">
                {dayjs((submission as import('@yurigaoka-app/common').HomecomingSubmission).startDate).format(
                  'YYYY年MM月DD日 HH:mm'
                )}
                <span className="mx-1">~</span>
                {dayjs((submission as import('@yurigaoka-app/common').HomecomingSubmission).endDate).format(
                  'YYYY年MM月DD日 HH:mm'
                )}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <TextLabel label="帰省先" />
                <p className="text-(--main-text)">{location?.name || '取得中...'}</p>
              </div>

              <div>
                <TextLabel label="帰省理由" />
                <p className="text-(--main-text)">{submission.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 欠食情報 */}
      <div className="flex flex-col gap-4 bg-white rounded-md p-4 border border-(--border-gray)">
        <div className="flex items-center gap-1">
          <ForkKnife className="w-4 h-4 text-(--main-blue)" />
          <p className="text-(--main-text) font-bold">欠食情報</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div>
              <TextLabel label="欠食期間" />
              <p className="text-(--main-text)">
                {dayjs(submission.mealsOff[0]?.date).format('YYYY年MM月DD日')}
                {submission.mealsOff[0]?.breakfast ? '朝食' : ''}
                {submission.mealsOff[0]?.dinner ? '夕食' : ''}
                <span className="mx-1">~</span>
                {dayjs(submission.mealsOff[submission.mealsOff.length - 1]?.date).format('YYYY年MM月DD日')}
                {submission.mealsOff[submission.mealsOff.length - 1]?.breakfast ? '朝食' : ''}
                {submission.mealsOff[submission.mealsOff.length - 1]?.dinner ? '夕食' : ''}
              </p>
            </div>
            {submission.type !== '帰省' && (
              <div>
                <TextLabel label="欠食理由" />
                <p className="text-(--main-text)">{submission.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
