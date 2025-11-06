import { getAllSubmissions } from './actions'
import { Report } from './_type/report'
import ReportsClient from './_components/reports-client'
import { convertMealsOffToMeals } from '@/utils/submissionUtils'

export default async function StudentsPage() {
  // Server Actionsで申請を取得
  const submissions = await getAllSubmissions()

  // Report型に変換
  const reports: Report[] = submissions.map((submission) => {
    const baseReport: Report = {
      id: submission.id,
      name: submission.userName,
      grade: submission.userGrade ? parseInt(submission.userGrade) : 0,
      class: submission.userClass || '',
      type: submission.type === '帰省' ? 'homecoming' : 'meal',
      createdAt: submission.createdAt,
      status: submission.status,
      rejectReason: submission.rejectReason,
      reason: submission.reason,
      specialReason: submission.specialReason,
      meals: convertMealsOffToMeals(submission.mealsOff),
    }

    // 帰省申請の場合、追加情報を設定
    if (submission.type === '帰省') {
      const homecomingSubmission = submission as import('@yurigaoka-app/common').HomecomingSubmission & {
        locationName?: string
        locationAddress?: string
        userPhoneNumber?: string
      }
      baseReport.startDate = homecomingSubmission.startDate
      baseReport.endDate = homecomingSubmission.endDate
      baseReport.homeName = homecomingSubmission.locationName
      baseReport.address = homecomingSubmission.locationAddress
      baseReport.phoneNumber = homecomingSubmission.userPhoneNumber
    } else {
      // 欠食申請の場合、startDateとendDateをmealsOffから取得
      const mealAbsenceSubmission = submission as import('@yurigaoka-app/common').MealAbsenceSubmission
      if (mealAbsenceSubmission.mealsOff.length > 0) {
        const sortedMealsOff = [...mealAbsenceSubmission.mealsOff].sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date)
          const dateB = b.date instanceof Date ? b.date : new Date(b.date)
          return dateA.getTime() - dateB.getTime()
        })
        baseReport.startDate =
          sortedMealsOff[0].date instanceof Date ? sortedMealsOff[0].date : new Date(sortedMealsOff[0].date)
        baseReport.endDate =
          sortedMealsOff[sortedMealsOff.length - 1].date instanceof Date
            ? sortedMealsOff[sortedMealsOff.length - 1].date
            : new Date(sortedMealsOff[sortedMealsOff.length - 1].date)
      }
    }

    return baseReport
  })

  return <ReportsClient reports={reports} />
}
