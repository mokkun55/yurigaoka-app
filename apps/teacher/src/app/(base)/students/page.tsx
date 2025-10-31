import { User } from '@yurigaoka-app/common'
import { getAllStudents } from './actions'
import StudentsClient from './_components/students-client'

export default async function StudentsPage() {
  // Server Actionsで生徒を取得
  const students = await getAllStudents()

  // clubがnullの場合は"未所属/その他"と表示
  // nameがnullまたは空の学生は除外
  const studentsWithStatus = students
    .filter((student): student is User & { name: string } => student.name !== undefined && student.name.trim() !== '')
    .map((student) => ({
      ...student,
      name: student.name,
      club: student.club ?? '未所属/その他',
      status: 'stay' as const, // statusは固定
    }))

  return <StudentsClient initialStudents={studentsWithStatus} />
}
