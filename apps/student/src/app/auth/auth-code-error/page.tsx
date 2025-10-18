'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthCodeErrorPage: React.FC = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string>('認証中に不明なエラーが発生しました。')

  useEffect(() => {
    // クエリパラメータ取得
    const searchParams = new URLSearchParams(window.location.search)
    const error_description = searchParams.get('error_description')

    // ハッシュパラメータ取得
    let hashErrorDesc = null
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.slice(1))
      hashErrorDesc = hashParams.get('error_description')
    }

    if (hashErrorDesc) {
      setErrorMessage(decodeURIComponent(hashErrorDesc).replace(/\+/g, ' '))
    } else if (error_description) {
      setErrorMessage(decodeURIComponent(error_description).replace(/\+/g, ' '))
    }

    // カスタムエラーメッセージ
    if (errorMessage.includes('INCORRECT_DOMAIN')) {
      setErrorMessage('このメールアドレスドメインでのサインアップは許可されていません。')
    }
    // その他のカスタムエラーメッセージがあれば追加
    // else if (errorMessage.includes('OTHER_CUSTOM_ERROR')) {
    //   setErrorMessage('その他カスタムエラーのメッセージ。');
    // }

    // errorMessageをコンソールに表示
    console.error('AuthCodeErrorPage errorMessage:', errorMessage)
  }, [errorMessage]) // errorMessageのみ依存配列に

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-5 text-center">
      <title>認証エラー</title>

      <h1 className="text-4xl font-bold text-red-600 mb-5">認証エラーが発生しました</h1>
      <p className="text-lg mb-8 max-w-2xl leading-relaxed">エラー文: {errorMessage}</p>
      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
      >
        トップページに戻る
      </button>
    </div>
  )
}

export default AuthCodeErrorPage
