import type { SubmissionWithUserAndLocation } from '@/app/(base)/home/actions'

/**
 * SubmissionWithUserAndLocationをReportコンポーネントが期待する形式に変換
 */
export function convertSubmissionToReportItem(submission: SubmissionWithUserAndLocation) {
  // mealsOffから最初と最後の食事を抽出
  const sortedMealsOff = [...submission.mealsOff].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date)
    const dateB = b.date instanceof Date ? b.date : new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  const firstMeal = sortedMealsOff[0]
  const lastMeal = sortedMealsOff[sortedMealsOff.length - 1]

  let startMeal: 'breakfast' | 'dinner' = 'breakfast'
  let endMeal: 'breakfast' | 'dinner' = 'breakfast'
  let startDate: Date
  let endDate: Date

  if (submission.type === '帰省') {
    // 帰省申請の場合
    const homecomingSubmission = submission
    startDate =
      homecomingSubmission.startDate instanceof Date
        ? homecomingSubmission.startDate
        : new Date(homecomingSubmission.startDate)
    endDate =
      homecomingSubmission.endDate instanceof Date
        ? homecomingSubmission.endDate
        : new Date(homecomingSubmission.endDate)

    // 最初の日付の食事を決定
    if (firstMeal) {
      const firstMealDate = firstMeal.date instanceof Date ? firstMeal.date : new Date(firstMeal.date)
      if (firstMealDate.toDateString() === startDate.toDateString()) {
        startMeal = firstMeal.breakfast ? 'breakfast' : 'dinner'
      } else {
        // 最初の日付がstartDateと異なる場合は、startDateの時間から判断
        startMeal = startDate.getHours() < 12 ? 'breakfast' : 'dinner'
      }
    } else {
      startMeal = startDate.getHours() < 12 ? 'breakfast' : 'dinner'
    }

    // 最後の日付の食事を決定
    if (lastMeal) {
      const lastMealDate = lastMeal.date instanceof Date ? lastMeal.date : new Date(lastMeal.date)
      if (lastMealDate.toDateString() === endDate.toDateString()) {
        endMeal = lastMeal.dinner ? 'dinner' : 'breakfast'
      } else {
        endMeal = endDate.getHours() < 12 ? 'breakfast' : 'dinner'
      }
    } else {
      endMeal = endDate.getHours() < 12 ? 'breakfast' : 'dinner'
    }
  } else {
    // 欠食申請の場合
    if (sortedMealsOff.length > 0) {
      startDate = firstMeal.date instanceof Date ? firstMeal.date : new Date(firstMeal.date)
      endDate = lastMeal.date instanceof Date ? lastMeal.date : new Date(lastMeal.date)
      startMeal = firstMeal.breakfast ? 'breakfast' : 'dinner'
      endMeal = lastMeal.dinner ? 'dinner' : 'breakfast'
    } else {
      // mealsOffが空の場合は現在の日時を使用（通常は発生しない）
      startDate = new Date()
      endDate = new Date()
    }
  }

  return {
    id: submission.id,
    name: submission.userName,
    grade: submission.userGrade ? parseInt(submission.userGrade) : 0,
    createdAt: submission.createdAt instanceof Date ? submission.createdAt.toISOString() : submission.createdAt,
    address: submission.locationAddress || '',
    phoneNumber: submission.userPhoneNumber || '',
    club: submission.userClub,
    meals: {
      startMeal,
      endMeal,
    },
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    reason: submission.reason,
    specialReason: submission.specialReason,
  }
}
