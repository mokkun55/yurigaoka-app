export type Report = {
  id: number
  name: string
  grade: number
  class: string
  type: 'homecoming' | 'meal'
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected' | 'canceled'
  rejectReason?: string
}
