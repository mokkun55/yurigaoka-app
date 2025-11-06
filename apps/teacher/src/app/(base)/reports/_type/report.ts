export type Report = {
  id: string
  name: string
  grade: number
  class: string
  type: 'homecoming' | 'meal'
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected' | 'canceled'
  rejectReason?: string
  // 帰省申請の場合
  startDate?: Date
  endDate?: Date
  homeName?: string
  address?: string
  phoneNumber?: string
  reason?: string
  specialReason?: string
  meals?: {
    startMeal: boolean[]
    endMeal: boolean[]
  }
}
