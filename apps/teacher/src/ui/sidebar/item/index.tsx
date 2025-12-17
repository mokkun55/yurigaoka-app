'use client'

import styles from './styles.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, LampCeiling, FileText, Users, Settings, Key, UserRoundCog } from 'lucide-react'

type Item = {
  href: string
  label: string
  icon: React.ReactNode
}

const items: Item[] = [
  {
    href: '/home',
    label: 'ホーム',
    icon: <House />,
  },
  {
    href: '/students/on-leave',
    label: '帰省者一覧',
    icon: <LampCeiling />,
  },
  {
    href: '/reports',
    label: 'すべての申請',
    icon: <FileText />,
  },
  {
    href: '/students',
    label: '寮生一覧',
    icon: <Users />,
  },
  {
    href: '/code',
    label: '招待コードの管理',
    icon: <Key />,
  },
  {
    href: '/students/leaders',
    label: '指導寮生の管理',
    icon: <UserRoundCog />,
  },
  {
    href: '/settings',
    label: '設定',
    icon: <Settings />,
  },
]

type Props = {
  label: Item['label']
}

export const SidebarItem = ({ label }: Props) => {
  const pathname = usePathname()
  const item = items.find((item) => item.label === label)

  if (!item) {
    return null
  }

  // URLベースでアクティブなタブを判定
  const isActive = pathname === item.href

  const isActiveClass = isActive ? styles.sidebarItemActive : ''

  return (
    <Link href={item.href} className={`${styles.sidebarItem} ${isActiveClass}`}>
      <div className={styles.sidebarItemIcon}>{item.icon}</div>
      <h2 className={styles.sidebarItemLabel}>{item.label}</h2>
    </Link>
  )
}
