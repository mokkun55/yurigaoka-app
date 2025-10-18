'use client'

import BaseButton from '@/ui/base-button'
import styles from './styles.module.css'
import { useAuth } from '@/hooks/useAuth'
import { ShieldBan } from 'lucide-react'

export default function AccessDeniedPage() {
  const { signOut } = useAuth()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ShieldBan className={styles.icon} size={64} />
        <h1 className={styles.title}>アクセスが拒否されました</h1>
        <p className={styles.description}>あなたはこのページにアクセスする権限がありません。</p>

        <div className={styles.actions}>
          <BaseButton onClick={signOut} width="280px">
            別のアカウントでログインする
          </BaseButton>
        </div>
      </div>
    </div>
  )
}
