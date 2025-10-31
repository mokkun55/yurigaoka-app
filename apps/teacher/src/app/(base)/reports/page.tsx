import { getAllSubmissions } from './actions'
import { Report } from './_type/report'
import ReportsClient from './_components/reports-client'

export default async function StudentsPage() {
  // Server Actionsで申請を取得
  const submissions = await getAllSubmissions()

  // Report型に変換
  const reports: Report[] = submissions.map((submission, index) => ({
    id: index + 1, // インデックスベースのID
    name: submission.userName,
    grade: submission.userGrade ? parseInt(submission.userGrade) : 0,
    class: submission.userClass || '',
    type: submission.type === '帰省' ? 'homecoming' : 'meal',
    createdAt: submission.createdAt,
    status: submission.status,
  }))

  return <ReportsClient reports={reports} />
}
