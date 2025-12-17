'use client'

import { House, Utensils, History, Clock, User } from 'lucide-react'
import Link from 'next/link'
import ApplicationCard from '@/_components/ui/application-card'
import { useFirebaseAuthContext } from '@/providers/AuthProvider'
import { getUserSettings } from '../(setting)/setting/actions'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/_components/ui/loading-spinner'

export default function Home() {
  const { uid, currentUser } = useFirebaseAuthContext()
  const [roomNumber, setRoomNumber] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!uid) {
        setLoading(false)
        return
      }

      try {
        const settings = await getUserSettings()
        setRoomNumber(settings.roomNumber || '')
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [uid])

  return (
    <div className="p-4 gap-4 flex flex-col overflow-y-auto">
      {/* こんにちはカード */}
      <div className="bg-white rounded-md py-7 px-4 flex items-center gap-4 border border-(--border-gray)">
        <div
          className="rounded-lg p-4 flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--background-light)' }}
        >
          <User size={24} style={{ color: 'var(--main-blue)' }} />
        </div>
        <div className="flex flex-col gap-1">
          {loading ? (
            <LoadingSpinner size={16} />
          ) : (
            <>
              <p className="text-lg font-bold text-gray-800">{roomNumber ? `${roomNumber}号室` : ''}</p>
              <p className="text-lg text-gray-800">こんにちは、{currentUser?.displayName || '寮生'}さん</p>
            </>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">申請メニュー</h1>
      </div>

      <div className="flex flex-col gap-3">
        <ApplicationCard
          href="/absence/home"
          icons={[<House size={24} key="house" />, <Utensils size={24} key="utensils" />]}
          text="帰省・欠食届を出す"
          description="実家への帰省や外泊の申請はこちら"
        />
        <ApplicationCard
          href="/absence/meal"
          icons={[<Utensils size={24} key="utensils" />]}
          text="欠食届のみを出す"
          description="食事が不要な場合の申請はこちら"
        />
        <Link
          href="/history"
          className="bg-white rounded-md py-7 px-4 flex items-center gap-3 border border-(--border-gray) cursor-pointer w-full"
        >
          <div
            className="rounded-lg p-4 flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--background-light)' }}
          >
            <History size={24} style={{ color: 'var(--main-blue)' }} />
          </div>
          <p className="text-lg font-bold text-gray-800 flex-1">申請履歴を確認する</p>
        </Link>
      </div>

      <div className="mt-4 p-4 rounded-md border border-gray-200" style={{ backgroundColor: '#fef7ed' }}>
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-orange-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold" style={{ color: '#7c2d12' }}>
              提出可能時間について
            </h2>
            <div className="flex flex-col gap-1">
              <p className="text-sm" style={{ color: '#7c2d12' }}>
                申請は、平日(学校が休みではない日)の9:00~17:00までに行ってください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
