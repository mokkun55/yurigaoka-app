'use client'

import { StudentWithHomecoming, StudentsByGrade, getLocationById } from '../../actions'
import { groupStudentsByGrade, isMorningRollCallHomecoming, isEveningRollCallHomecoming } from '../../utils'
import styles from './styles.module.css'
import { useMemo, useState, Fragment } from 'react'
import DetailModal from '@/app/(base)/reports/_components/detail-modal'
import { Report } from '@/app/(base)/reports/_type/report'
import { HomecomingSubmission, Location, RollCallTime } from '@yurigaoka-app/common'
import { convertMealsOffToMeals } from '@/utils/submissionUtils'
import BaseModal from '@/ui/base-modal'

type Props = {
  students: StudentWithHomecoming[]
  year: number
  month: number
  rollCallTime: RollCallTime
}

const dayNames = ['日', '月', '火', '水', '木', '金', '土']

/**
 * HomecomingSubmissionをReport型に変換
 */
function convertToReport(
  submission: HomecomingSubmission,
  user: { name?: string; grade?: string; class?: string; phoneNumber?: string },
  location: Location | null
): Report {
  const meals = convertMealsOffToMeals(submission.mealsOff)

  return {
    id: submission.id,
    name: user.name || '',
    grade: parseInt(user.grade?.match(/\d+/)?.[0] || '0'),
    class: user.class || '',
    type: 'homecoming',
    createdAt: submission.createdAt instanceof Date ? submission.createdAt : new Date(submission.createdAt),
    status: submission.status,
    rejectReason: submission.rejectReason,
    startDate: submission.startDate instanceof Date ? submission.startDate : new Date(submission.startDate),
    endDate: submission.endDate instanceof Date ? submission.endDate : new Date(submission.endDate),
    homeName: location?.name || '',
    address: location?.address || '',
    phoneNumber: user.phoneNumber || '',
    reason: submission.reason,
    specialReason: submission.specialReason,
    meals: {
      startMeal: meals.startMeal,
      endMeal: meals.endMeal,
    },
  }
}

function GradeTable({
  gradeGroup,
  year,
  month,
  rollCallTime,
}: {
  gradeGroup: StudentsByGrade
  year: number
  month: number
  rollCallTime: RollCallTime
}) {
  const { grade, students } = gradeGroup
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 指定された月の日付リストを生成
  const dates = useMemo(() => {
    const lastDay = new Date(year, month, 0)
    const days: Date[] = []

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month - 1, day))
    }

    return days
  }, [year, month])

  // 日付が日曜日かどうか
  const isSunday = (date: Date) => date.getDay() === 0

  // 今日の日付かどうか
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  // 日付セルをクリックした時の処理
  const handleDateCellClick = async (date: Date, studentData: StudentWithHomecoming) => {
    // その日付を含む帰省申請を見つける
    const targetSubmission = studentData.homecomingSubmissions.find((submission) => {
      const startDate = submission.startDate instanceof Date ? submission.startDate : new Date(submission.startDate)
      const endDate = submission.endDate instanceof Date ? submission.endDate : new Date(submission.endDate)

      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

      return checkDate >= start && checkDate <= end
    })

    if (!targetSubmission) return

    // Location情報を取得
    const location = await getLocationById(targetSubmission.locationId)

    // Report型に変換してモーダルを表示
    const report = convertToReport(targetSubmission, studentData.user, location)
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className={styles.gradeTableContainer}>
        <h2 className={styles.gradeTitle}>{grade}</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              {/* 月表示行 */}
              <tr>
                <th className={styles.monthHeader}></th>
                <th colSpan={3} className={styles.monthHeader}>
                  {month}月
                </th>
                {dates.map((date) => (
                  <th
                    key={date.getTime()}
                    colSpan={2}
                    className={`${styles.dateHeader} ${isToday(date) ? styles.today : ''}`}
                  >
                    {date.getDate()}
                  </th>
                ))}
              </tr>
              {/* 列ヘッダー行（曜日） */}
              <tr>
                <th className={styles.labelHeader}></th>
                <th className={styles.labelHeader}>名前</th>
                <th className={styles.labelHeader}>部活</th>
                <th className={styles.labelHeader}>部屋番号</th>
                {dates.map((date) => (
                  <th
                    key={date.getTime()}
                    colSpan={2}
                    className={`${styles.dayHeader} ${isSunday(date) ? styles.sunday : ''} ${isToday(date) ? styles.today : ''}`}
                  >
                    {dayNames[date.getDay()]}
                  </th>
                ))}
              </tr>
              {/* 点呼時間ヘッダー行 */}
              <tr>
                <th className={styles.labelHeader}></th>
                <th className={styles.labelHeader}></th>
                <th className={styles.labelHeader}></th>
                <th className={styles.labelHeader}></th>
                {dates.map((date) => (
                  <Fragment key={date.getTime()}>
                    <th
                      className={`${styles.rollCallHeader} ${isSunday(date) ? styles.sunday : ''} ${isToday(date) ? styles.today : ''}`}
                    >
                      朝
                    </th>
                    <th
                      className={`${styles.rollCallHeader} ${isSunday(date) ? styles.sunday : ''} ${isToday(date) ? styles.today : ''}`}
                    >
                      夜
                    </th>
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((studentData, index) => {
                const { user, homecomingSubmissions } = studentData

                return (
                  <tr key={user.id} className={styles.studentRow}>
                    <td className={styles.numberCell}>{index + 1}</td>
                    <td className={styles.nameCell}>{user.name}</td>
                    <td className={styles.clubCell}>{user.club || ''}</td>
                    <td className={styles.roomCell}>{user.roomNumber || ''}</td>
                    {dates.map((date) => {
                      // 朝点呼と夜点呼の時点での帰省状態を判定
                      // 帰省中（不在）の場合はtrue、在室の場合はfalse
                      const morningRollCall = isMorningRollCallHomecoming(date, homecomingSubmissions, rollCallTime)
                      const eveningRollCall = isEveningRollCallHomecoming(date, homecomingSubmissions, rollCallTime)

                      const isTodayDate = isToday(date)

                      return (
                        <Fragment key={date.getTime()}>
                          {/* 朝点呼セル */}
                          <td
                            className={`${styles.rollCallCell} ${morningRollCall ? styles.present : styles.empty} ${morningRollCall ? styles.clickable : ''} ${isTodayDate ? styles.today : ''}`}
                            onClick={() => morningRollCall && handleDateCellClick(date, studentData)}
                          >
                            {morningRollCall ? '' : <span className={styles.dot}>・</span>}
                          </td>
                          {/* 夜点呼セル */}
                          <td
                            className={`${styles.rollCallCell} ${eveningRollCall ? styles.present : styles.empty} ${eveningRollCall ? styles.clickable : ''} ${isTodayDate ? styles.today : ''}`}
                            onClick={() => eveningRollCall && handleDateCellClick(date, studentData)}
                          >
                            {eveningRollCall ? '' : <span className={styles.dot}>・</span>}
                          </td>
                        </Fragment>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <BaseModal opened={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        {selectedReport && <DetailModal report={selectedReport} onClose={() => setIsModalOpen(false)} />}
      </BaseModal>
    </>
  )
}

export default function TableView({ students, year, month, rollCallTime }: Props) {
  // 学年ごとにグループ化
  const gradeGroups = useMemo(() => {
    return groupStudentsByGrade(students)
  }, [students])

  return (
    <div className={styles.container}>
      {gradeGroups.map((gradeGroup) => (
        <GradeTable
          key={gradeGroup.grade}
          gradeGroup={gradeGroup}
          year={year}
          month={month}
          rollCallTime={rollCallTime}
        />
      ))}
    </div>
  )
}
