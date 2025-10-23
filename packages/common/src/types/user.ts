export type User = {
  id: string
  email: string
  name: string
  createdAt: Date
  isDeleted: boolean
  grade?: string
  class?: string
  club?: string
  roomNumber?: string
  phoneNumber?: string
}
