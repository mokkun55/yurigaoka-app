import Link from 'next/link'
import { Home, History, Settings } from 'lucide-react'

type Props = {
  activeTab: 'home' | 'history' | 'setting'
}

export default function Footer({ activeTab }: Props) {
  return (
    <div className="flex justify-center bg-white border-t border-(--border-gray) sticky bottom-0 w-full px-8 h-20">
      <div className="flex justify-between w-full p-4">
        <Link href="/" className="flex flex-col items-center">
          <Home size={24} color={activeTab === 'home' ? 'var(--main-blue)' : 'var(--sub-text)'} />
          <p className={`text-sm ${activeTab === 'home' ? 'text-(--main-blue)' : 'text-(--sub-text)'}`}>ホーム</p>
        </Link>
        <Link href="/history" className="flex flex-col items-center">
          <History size={24} color={activeTab === 'history' ? 'var(--main-blue)' : 'var(--sub-text)'} />
          <p className={`text-sm ${activeTab === 'history' ? 'text-(--main-blue)' : 'text-(--sub-text)'}`}>申請履歴</p>
        </Link>
        <Link href="/setting" className="flex flex-col items-center">
          <Settings size={24} color={activeTab === 'setting' ? 'var(--main-blue)' : 'var(--sub-text)'} />
          <p className={`text-sm ${activeTab === 'setting' ? 'text-(--main-blue)' : 'text-(--sub-text)'}`}>設定</p>
        </Link>
      </div>
    </div>
  )
}
