import dayjs from '@/libs/dayjs'
import styles from './styles.module.css'
import BaseModal from '@/ui/base-modal'
import { useDisclosure } from '@mantine/hooks'
import HomecomingInfo from '@/ui/homecoming-info'
import { Calendar, FileText } from 'lucide-react'
import BaseButton from '@/ui/base-button'

type Props = {
  id: number // absenceId モーダルとkeyに使う
  grade: number
  name: string
  roomNumber: number
  startDate: Date
  endDate: Date
}

const reportTypeMap = {
  homecoming: '帰省・欠食届',
  meal: '欠食届のみ',
}

// TODO 動的に取得する
const homecomingInfoData = {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-02'),
  homeName: '実家',
  address: '大阪府大阪市大阪区1-1-1',
  phoneNumber: '090-1234-5678',
  reason: '家族の用事',
  specialReason: '祖母の体調不良のため',
  meals: {
    startMeal: [false, false],
    endMeal: [false, false],
  },
}
// こちらも動的に取得する
const createdAt = new Date('2025-01-01')
const absenceType = 'homecoming'

export default function StudentList({ id, grade, name, roomNumber, startDate, endDate }: Props) {
  const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false)

  const handleClick = () => {
    modalOpen()
    fetchReportData()
  }

  // モーダルが開かれると提出を取得する
  const fetchReportData = async () => {
    console.log(id)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <div className={styles.nameContainer}>
            <p>
              {grade}年 {name} ({roomNumber}号室)
            </p>
          </div>
          <div className={styles.dateContainer}>
            <p>
              {dayjs(startDate).format('YYYY/MM/DD hh:mm')} ~ {dayjs(endDate).format('YYYY/MM/DD hh:mm')}
            </p>
          </div>
        </div>
        <div className={styles.controlContainer}>
          <button className={styles.button} onClick={handleClick}>
            詳細を見る
          </button>
        </div>
      </div>

      {/* 帰省情報モーダル */}
      <BaseModal opened={modalOpened} onClose={modalClose}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.studentInfo}>
              <h1 className={styles.name}>
                {grade}年 {name}
              </h1>
            </div>

            {/* 申請info */}
            <div className={styles.applyInfo}>
              <div className={styles.labels}>
                <div className={styles.labelText}>
                  <Calendar size={16} />
                  申請日
                </div>
                <div className={styles.labelText}>
                  <FileText size={16} />
                  申請種別
                </div>
              </div>
              <div className={styles.values}>
                <div className={styles.date}>{dayjs(createdAt).format('YYYY年M月D日 (ddd)')}</div>
                <div className={styles.applyType}>{reportTypeMap[absenceType]}</div>
              </div>
            </div>
          </div>

          <HomecomingInfo
            startDate={startDate}
            endDate={endDate}
            homeName={homecomingInfoData.homeName}
            address={homecomingInfoData.address}
            phoneNumber={homecomingInfoData.phoneNumber}
            reason={homecomingInfoData.reason}
            specialReason={homecomingInfoData.specialReason}
            meals={homecomingInfoData.meals}
          />
          <BaseButton onClick={modalClose} variant="secondary">
            閉じる
          </BaseButton>
        </div>
      </BaseModal>
    </>
  )
}
