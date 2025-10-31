'use client'

import styles from './styles.module.css'

export default function StudentAccessDenied() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>アクセス拒否</h1>
        <p className={styles.subtitle}>学生アカウントでは教員用ページにアクセスできません</p>
      </div>

      <div className={styles.description}>
        <p>このページは教員専用です。</p>
        <p>学生用ページにアクセスする場合は、学生用アプリケーションをご利用ください。</p>
      </div>

      <a href="/login" className={styles.loginLink}>
        教員用ログインページに戻る
      </a>
    </div>
  )
}
