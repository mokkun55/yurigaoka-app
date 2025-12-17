export type TeacherWhitelist = {
  id: string
  email: string
  role: 'teacher' | 'manager'
  createdAt: Date
}
