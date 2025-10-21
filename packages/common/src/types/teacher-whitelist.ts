export type TeacherWhitelist = {
  id: string
  email: string
  role: string
}

export type TeacherWhitelistData = Omit<TeacherWhitelist, 'id'>
