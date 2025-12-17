import styles from './layout.module.css'
import { SidebarItem } from '../../ui/sidebar/item'
import { PageHeader } from '../../ui/header/page-header'

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={styles.container}>
      {/* サイドバー */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarHeaderTitle}>帰省届管理ツール</h1>
        </div>

        <div className={styles.sidebarContent}>
          <SidebarItem label="ホーム" />
          <SidebarItem label="帰省者一覧" />
          <SidebarItem label="すべての申請" />
          <SidebarItem label="寮生一覧" />
          <SidebarItem label="招待コードの管理" />
          <SidebarItem label="先生&寮長の管理" />
          <SidebarItem label="設定" />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className={styles.mainContent}>
        {/* ヘッダー */}
        <PageHeader />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
