'use client'

import BaseButton from '@/ui/base-button'
import styles from './styles.module.css'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const { signInWithGoogle } = useAuth()

  const handleGoogleLogin = async () => {
    const error = await signInWithGoogle()
    if (error) {
      console.error(error)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>百合ヶ丘寮帰省届管理ツール</h1>
        <p className={styles.subtitle}>ようこそ!</p>
      </div>

      <BaseButton onClick={handleGoogleLogin} width="300px">
        教員用アカウントでログイン
      </BaseButton>
      <p className={styles.description}>学校から配布された教員用Googleアカウント(ktc.ac.jp)でログインしてください。</p>
    </div>
  )
}
