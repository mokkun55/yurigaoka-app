import Status from './_components/status'
import Report from './_components/report'
import styles from './styles.module.css'

const studentsCount = 100
const onLeaveCount = 10

// モックデータ
const mockReportItems: {
  id: string
  name: string
  grade: number
  createdAt: string
  address: string
  phoneNumber: string
  club?: string
  meals: {
    startMeal: 'breakfast' | 'dinner'
    endMeal: 'breakfast' | 'dinner'
  }
  startDate: string
  endDate: string
  reason: string
  specialReason?: string
}[] = [
  {
    id: '1',
    name: '田中太郎',
    grade: 2,
    createdAt: '2025-01-15T00:00:00.000Z',
    address: '東京都渋谷区1-1-1',
    phoneNumber: '090-1234-5678',
    club: 'ソフトテニス',
    meals: {
      startMeal: 'dinner',
      endMeal: 'breakfast',
    },
    startDate: '2025-01-20T18:00:00.000Z',
    endDate: '2025-01-22T08:00:00.000Z',
    reason: '家族の用事',
    specialReason: '祖母の体調不良のため',
  },
  {
    id: '2',
    name: '佐藤花子',
    grade: 1,
    createdAt: '2025-01-14T00:00:00.000Z',
    address: '神奈川県横浜市2-2-2',
    phoneNumber: '080-9876-5432',
    club: 'サッカー',
    meals: {
      startMeal: 'breakfast',
      endMeal: 'dinner',
    },
    startDate: '2025-01-25T08:00:00.000Z',
    endDate: '2025-01-26T18:00:00.000Z',
    reason: 'アルバイト',
  },
  {
    id: '3',
    name: '山田次郎',
    grade: 3,
    createdAt: '2025-01-13T00:00:00.000Z',
    address: '埼玉県さいたま市3-3-3',
    phoneNumber: '070-1111-2222',
    club: undefined,
    meals: {
      startMeal: 'dinner',
      endMeal: 'dinner',
    },
    startDate: '2025-01-28T18:00:00.000Z',
    endDate: '2025-01-29T18:00:00.000Z',
    reason: '病院の予約',
  },
  {
    id: '4',
    name: '鈴木美咲',
    grade: 2,
    createdAt: '2025-01-12T00:00:00.000Z',
    address: '千葉県千葉市4-4-4',
    phoneNumber: '090-3333-4444',
    club: 'ソフトテニス',
    meals: {
      startMeal: 'breakfast',
      endMeal: 'breakfast',
    },
    startDate: '2025-01-30T08:00:00.000Z',
    endDate: '2025-01-31T08:00:00.000Z',
    reason: '友人の結婚式',
    specialReason: '遠方のため前日から移動',
  },
  {
    id: '5',
    name: '高橋健太',
    grade: 1,
    createdAt: '2025-01-11T00:00:00.000Z',
    address: '茨城県水戸市5-5-5',
    phoneNumber: '080-5555-6666',
    club: 'サッカー',
    meals: {
      startMeal: 'dinner',
      endMeal: 'breakfast',
    },
    startDate: '2025-02-01T18:00:00.000Z',
    endDate: '2025-02-03T08:00:00.000Z',
    reason: '実家の用事',
  },
  {
    id: '6',
    name: '伊藤愛',
    grade: 3,
    createdAt: '2025-01-10T00:00:00.000Z',
    address: '栃木県宇都宮市6-6-6',
    phoneNumber: '070-7777-8888',
    club: 'ソフトテニス',
    meals: {
      startMeal: 'breakfast',
      endMeal: 'dinner',
    },
    startDate: '2025-02-05T08:00:00.000Z',
    endDate: '2025-02-06T18:00:00.000Z',
    reason: '部活動の大会',
  },
  {
    id: '7',
    name: '渡辺翔太',
    grade: 2,
    createdAt: '2025-01-09T00:00:00.000Z',
    address: '群馬県前橋市7-7-7',
    phoneNumber: '090-9999-0000',
    club: undefined,
    meals: {
      startMeal: 'dinner',
      endMeal: 'dinner',
    },
    startDate: '2025-02-08T18:00:00.000Z',
    endDate: '2025-02-09T18:00:00.000Z',
    reason: '歯科治療',
  },
]

export default function Home() {
  return (
    <div className={styles.container}>
      {/* 寮の状態 */}
      <div className={styles.dormitoryStatus}>
        <div className={styles.title}>寮の状態 (本日)</div>
        <div className={styles.statusContainer}>
          {/* 在寮人数 */}
          <Status studentCount={studentsCount} onLeaveCount={onLeaveCount} type="在寮人数" />
          {/* 帰省者数 */}
          <Status studentCount={studentsCount} onLeaveCount={onLeaveCount} type="帰省者数" />
        </div>
      </div>

      {/* 承認待ちの申請 */}
      <div className={styles.reportItems}>
        <div className={styles.title}>
          承認待ちの申請 <span className={styles.count}>({mockReportItems.length}件)</span>
        </div>
        <div className={styles.reportList}>
          <Report items={mockReportItems} />
        </div>
      </div>
    </div>
  )
}
