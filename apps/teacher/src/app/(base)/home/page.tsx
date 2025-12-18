import styles from './styles.module.css'
import { getPendingSubmissions } from './actions'
import { getUserRole } from '@/utils/auth'
import Link from 'next/link'
import { LampCeiling, FileText, Users, Key, UserRoundCog, Settings } from 'lucide-react'

export default async function Home() {
  // ロールを取得
  const role = await getUserRole()
  const isManager = role === 'manager'

  // 先生のみ承認待ちの申請を取得
  let pendingCount = 0
  if (!isManager) {
    const pendingSubmissions = await getPendingSubmissions()
    pendingCount = pendingSubmissions.length
  }

  // 全メニューアイテム
  const allMenuItems = [
    {
      href: '/students/on-leave',
      label: '帰省者一覧',
      description: '帰省中の寮生を確認',
      icon: <LampCeiling size={40} />,
      badge: null,
      color: 'orange',
      roles: ['teacher', 'manager'], // 全ロールがアクセス可能
    },
    {
      href: '/reports',
      label: 'すべての申請',
      description: '申請の承認・管理',
      icon: <FileText size={40} />,
      badge: pendingCount > 0 ? pendingCount : null,
      color: 'blue',
      roles: ['teacher'], // 先生のみ
    },
    {
      href: '/students',
      label: '寮生一覧',
      description: '寮生情報の管理',
      icon: <Users size={40} />,
      badge: null,
      color: 'green',
      roles: ['teacher', 'manager'], // 全ロールがアクセス可能
    },
    {
      href: '/code',
      label: '招待コードの管理',
      description: '招待コードの発行・削除',
      icon: <Key size={40} />,
      badge: null,
      color: 'purple',
      roles: ['teacher'], // 先生のみ
    },
    {
      href: '/students/leaders',
      label: '先生&寮長の管理',
      description: '権限の管理',
      icon: <UserRoundCog size={40} />,
      badge: null,
      color: 'indigo',
      roles: ['teacher'], // 先生のみ
    },
    {
      href: '/settings',
      label: '設定',
      description: 'システム設定',
      icon: <Settings size={40} />,
      badge: null,
      color: 'gray',
      roles: ['teacher'], // 先生のみ
    },
  ]

  // ロールに応じてメニューアイテムをフィルタリング
  const menuItems = allMenuItems.filter((item) => item.roles.includes(role || 'teacher'))

  return (
    <div className={styles.container}>
      <div className={styles.title}>ホーム画面</div>
      <div className={styles.grid}>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={`${styles.card} ${styles[`card_${item.color}`]}`}>
            <div className={styles.cardIconWrapper}>
              <div className={styles.cardIcon}>{item.icon}</div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>{item.label}</div>
              <div className={styles.cardDescription}>{item.description}</div>
            </div>
            {item.badge !== null && <div className={styles.badge}>{item.badge}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}
