'use client'

import { Button } from '@mantine/core'
import { Plus } from 'lucide-react'
import styles from './page-header.module.css'

type PageHeaderActionsProps = {
  pathname: string
}

export const PageHeaderActions = ({ pathname }: PageHeaderActionsProps) => {
  // ページごとのアクションを定義
  const getActionForPath = (path: string): React.ReactNode | null => {
    switch (path) {
      case '/notifications':
        return (
          <Button className={styles.pageHeaderButton}>
            <Plus />
            お知らせを新規作成
          </Button>
        )
      // 他のページのアクションもここに追加可能
      default:
        return null
    }
  }

  const action = getActionForPath(pathname)

  if (!action) {
    return null
  }

  return <>{action}</>
}
