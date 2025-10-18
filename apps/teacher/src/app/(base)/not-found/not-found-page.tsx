import styles from './not-found-page.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ページが見つかりません (404)</h1>
      <p className={styles.description}>右側サイドバーからページを選択してください</p>
    </div>
  )
}
