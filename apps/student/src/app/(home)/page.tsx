import { House, Utensils, History } from 'lucide-react'
import Link from 'next/link'
import ApplicationCard from '@/_components/ui/application-card'
import NoticeList from './_components/notice-list'

export default async function Home() {
  // TODO: Firebase認証でユーザー情報を取得
  // const user = await getCurrentUser()
  return (
    <div className="p-4 gap-4 flex flex-col text-center overflow-y-auto">
      <div>
        {/* TODO 〇〇さん */}
        <h1 className="text-2xl font-bold">こんにちは</h1>
        <p className="text-sm text-(--sub-text)">今日も一日頑張りましょう</p>
      </div>

      <div className="flex flex-col justify-center gap-2">
        <div className="flex gap-2 w-full">
          <ApplicationCard
            href="/absence/home"
            icons={[<House size={32} key="house" />, <Utensils size={32} key="utensils" />]}
            text="帰省・欠食届を出す"
          />
          <ApplicationCard
            href="/absence/meal"
            icons={[<Utensils size={32} key="utensils" />]}
            text="欠食届のみを出す"
          />
        </div>
        <Link
          href="/history"
          className="bg-white text-base font-bold flex items-center gap-2 text-center justify-center border border-(--border-gray) rounded-md p-2 cursor-pointer"
        >
          <History size={24} color="var(--main-blue)" />
          申請履歴を見る
        </Link>
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        <h1 className="text-base font-bold my-2">お知らせ</h1>
        <div className="gap-2 flex flex-col overflow-y-auto">
          <NoticeList />
        </div>
      </div>
    </div>
  )
}
