'use client'

import { useRouter } from 'next/navigation'

const TeacherAccessDeniedPage: React.FC = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-5 text-center">
      <title>アクセス権限エラー</title>

      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-red-600 mb-6">アクセスできません</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-xl mb-4 leading-relaxed">このアプリケーションは学生・寮長専用です。</p>
          <p className="text-lg text-gray-600 leading-relaxed">教員の方はアクセスできません。</p>
        </div>

        <button
          onClick={() => router.push('/logout')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          ログアウトする
        </button>
      </div>
    </div>
  )
}

export default TeacherAccessDeniedPage
