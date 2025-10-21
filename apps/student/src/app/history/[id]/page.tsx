// TODO ヘッダーを申請詳細にする

import { CalendarIcon, ForkKnife, HomeIcon } from 'lucide-react'
import Badge from '../_components/badge'
// import { fetchAbsenceById } from '../hooks/use-fetch-absences'
// import { fetchHomeById } from '../hooks/use-fetch-home'
import dayjs from 'dayjs'
import TextLabel from '@/_components/ui/text-label'
import type { Absence, Home } from '@yurigaoka-app/common'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function HistoryDetailPage({ params }: Props) {
  const resolvedParams = await params
  const { id } = resolvedParams

  // TODO: Firebaseに移行
  // let absence: Absence | null = null
  // try {
  //   absence = await fetchAbsenceById(Number(id))
  // } catch {
  //   return <div className="p-3 text-center">データの取得に失敗しました</div>
  // }

  // let home: Home | null = null
  // if (absence.type === 'homecoming' && absence.home_id) {
  //   home = await fetchHomeById(absence.home_id)
  // }

  return <div className="p-3 text-center">Firebase移行中のため、この機能は一時的に利用できません</div>

  // 以下のコードはFirebase移行後に有効化してください
  const absence: any = null
  const home: any = null

  return (
    <div className="p-3 flex flex-col flex-grow overflow-y-auto gap-4">
      <Badge
        type={absence.status as 'pending' | 'approved' | 'rejected' | 'canceled'}
        size="big"
        className="w-fit mx-auto"
      />

      <div className="flex flex-col gap-4 bg-white rounded-md p-4 border border-(--border-gray)">
        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-(--sub-text)">
            <CalendarIcon className="w-4 h-4" />
            <p>申請日</p>
          </div>
          <p className="text-(--main-text)">{dayjs(absence.created_at).format('YYYY年MM月DD日')}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-(--sub-text)">
            <CalendarIcon className="w-4 h-4" />
            <p>申請種別</p>
          </div>
          <p className="text-(--main-text)">{absence.type === 'homecoming' ? '帰省・欠食届' : '欠食届'}</p>
        </div>
      </div>

      {/* 帰省情報 */}
      {absence.type === 'homecoming' && (
        <div className="flex flex-col gap-4 bg-white rounded-md p-4 border border-(--border-gray)">
          <div className="flex items-center gap-1">
            <HomeIcon className="w-4 h-4 text-(--main-blue)" />
            <p className="text-(--main-text) font-bold">帰省情報</p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <TextLabel label="帰省期間" />
              <p className="text-(--main-text)">
                {dayjs(absence.start_date).format('YYYY年MM月DD日 HH:mm')}
                <span className="mx-1">~</span>
                {dayjs(absence.end_date).format('YYYY年MM月DD日 HH:mm')}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <TextLabel label="帰省先" />
                <p className="text-(--main-text)">{home?.name}</p>
                <p className="text-(--main-text)">{home?.address}</p>
              </div>

              <div>
                <TextLabel label="帰省理由" />
                <p className="text-(--main-text)">{absence.reason}</p>
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
                {dayjs(absence.start_date).format('YYYY年MM月DD日')}
                {absence.start_meal === 'breakfast' ? '朝食' : '夕食'}
                <span className="mx-1">~</span>
                {dayjs(absence.end_date).format('YYYY年MM月DD日')} {absence.end_meal === 'breakfast' ? '朝食' : '夕食'}
              </p>
            </div>
            {absence.type !== 'homecoming' && (
              <div>
                <TextLabel label="欠食理由" />
                <p className="text-(--main-text)">{absence.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
