'use client'

type PageHeaderActionsProps = {
  pathname: string
}

export const PageHeaderActions = ({ pathname }: PageHeaderActionsProps) => {
  // ページごとのアクションを定義
  const getActionForPath = (path: string): React.ReactNode | null => {
    switch (path) {
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
