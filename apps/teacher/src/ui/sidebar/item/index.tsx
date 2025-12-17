'use client'

import styles from './styles.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, LampCeiling, FileText, Users, Settings, Key, UserRoundCog } from 'lucide-react'
import { useEffect, useState } from 'react'

type Item = {
  href: string
  label: string
  icon: React.ReactNode
  roles?: ('teacher' | 'manager')[] // アクセス可能なロール（未指定の場合は全ロール）
}

const allItems: Item[] = [
  {
    href: '/home',
    label: 'ホーム',
    icon: <House />,
    roles: ['teacher'], // 寮長はアクセス不可
  },
  {
    href: '/students/on-leave',
    label: '帰省者一覧',
    icon: <LampCeiling />,
    // 全ロールがアクセス可能
  },
  {
    href: '/reports',
    label: 'すべての申請',
    icon: <FileText />,
    roles: ['teacher'], // 寮長はアクセス不可
  },
  {
    href: '/students',
    label: '寮生一覧',
    icon: <Users />,
    // 全ロールがアクセス可能
  },
  {
    href: '/code',
    label: '招待コードの管理',
    icon: <Key />,
    roles: ['teacher'], // 寮長はアクセス不可
  },
  {
    href: '/students/leaders',
    label: '先生&寮長の管理',
    icon: <UserRoundCog />,
    roles: ['teacher'], // 寮長はアクセス不可
  },
  {
    href: '/settings',
    label: '設定',
    icon: <Settings />,
    roles: ['teacher'], // 寮長はアクセス不可
  },
]

type Props = {
  label: Item['label']
}

export const SidebarItem = ({ label }: Props) => {
  const pathname = usePathname()
  const [role, setRole] = useState<'teacher' | 'manager' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/auth/verify-token')
        if (response.ok) {
          const data = await response.json()
          setRole(data.role === 'manager' ? 'manager' : 'teacher')
        }
      } catch (error) {
        console.error('Failed to fetch role:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRole()
  }, [])

  // ロールに応じて表示可能なアイテムをフィルタリング
  const items = allItems.filter((item) => {
    if (!item.roles) {
      return true // ロール指定がない場合は全ロールがアクセス可能
    }
    return item.roles.includes(role || 'teacher')
  })

  const item = items.find((item) => item.label === label)

  if (!item || loading) {
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
