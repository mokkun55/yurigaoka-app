import { createClient } from '@/utils/supabase/client'

// 学生一覧を取得するHOOKS
export const fetchStudents = async () => {
  const supabase = createClient()

  // usersテーブルとstudentsテーブルを結合して取得
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      name,
      students (
        grade_id,
        class_id,
        club_id,
        room_number,
        parent_name,
        phone_number,
        grades(name),
        classes(name),
        clubs(name)
      )
    `,
      { count: 'exact' }
    )
    .eq('role', 'student')
    .eq('is_deleted', false)

  if (error) {
    console.error('Error fetching students:', error)
    return { data: null, error }
  }

  // studentsオブジェクトをフラット化
  const flattenedData = data?.map((user) => {
    const studentData = Array.isArray(user.students) ? user.students[0] : user.students
    return {
      id: user.id,
      name: user.name ?? '',
      grade: studentData?.grades?.name ?? null,
      class: studentData?.classes?.name ?? null,
      club: studentData?.clubs?.name ?? null,
      room_number: studentData?.room_number ?? null,
      parent_name: studentData?.parent_name ?? null,
      phone_number: studentData?.phone_number ?? null,
    }
  })

  return { data: flattenedData, error: null }
}
