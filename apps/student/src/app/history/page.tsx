import HomeHistoryCard from './_components/history-card/HomeHistoryCard'
import MealHistoryCard from './_components/history-card/MealHistoryCard'
// import { fetchAbsences } from './hooks/use-fetch-absences'
import Link from 'next/link'
import type { Absence } from '@monorepo/common'

export default async function HistoryPage() {
  // TODO: Firebaseに移行
  const absences: Absence[] = []
  const homes: { id: number; name: string }[] = []

  // try {
  //   absences = await fetchAbsences()
  //   // home_id一覧を抽出
  //   const homeIds = Array.from(
  //     new Set(absences.map((a) => a.home_id).filter((id): id is number => typeof id === 'number'))
  //   )
  //   if (homeIds.length > 0) {
  //     // TODO: Firebaseでhome情報を取得
  //   }
  // } catch {
  //   return <div className="p-3 text-center">データの取得に失敗しました</div>
  // }
  // home_id→nameのMap
  const homeIdToName = new Map(homes.map((h) => [h.id, h.name]))
  return (
    <div className="p-3 flex flex-col flex-grow overflow-y-auto">
      <p className="text-center text-sm">申請履歴をクリックで詳細を見ることができます</p>
      <div className="mt-3 flex flex-col gap-4 overflow-y-auto flex-grow">
        {absences.length === 0 ? (
          <div className="text-center text-(--sub-text)">申請履歴がありません</div>
        ) : (
          absences.map((absence) => {
            const status = (absence.status ?? 'pending') as 'pending' | 'approved' | 'rejected' | 'canceled'
            // meal情報をstart_meal/end_mealから変換
            const meal = {
              startDate: {
                morning: absence.start_meal === 'breakfast',
                evening: absence.start_meal === 'dinner',
              },
              endDate: {
                morning: absence.end_meal === 'breakfast',
                evening: absence.end_meal === 'dinner',
              },
            }
            // home_idからplace取得
            const place = absence.home_id ? (homeIdToName.get(absence.home_id) ?? '') : ''
            if (absence.type === 'homecoming') {
              // 帰省届 & 欠食届
              return (
                <Link href={`/history/${absence.id}`} key={absence.id} className="block">
                  <HomeHistoryCard
                    status={status}
                    createdAt={absence.created_at}
                    period={{
                      startDate: absence.start_date ?? absence.created_at,
                      endDate: absence.end_date ?? absence.created_at,
                    }}
                    homecoming={{
                      id: String(absence.home_id ?? ''),
                      place,
                    }}
                    meal={meal}
                  />
                </Link>
              )
            } else {
              // 欠食届
              return (
                <Link href={`/history/${absence.id}`} key={absence.id} className="block">
                  <MealHistoryCard
                    status={status}
                    createdAt={absence.created_at}
                    period={{
                      startDate: absence.start_date ?? absence.created_at,
                      endDate: absence.end_date ?? absence.created_at,
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
