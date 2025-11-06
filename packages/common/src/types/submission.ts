export interface MealOff {
  date: Date
  breakfast: boolean
  dinner: boolean
}

export type SubmissionType = '帰省' | '欠食'

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'canceled'

export interface HomecomingSubmission {
  id: string
  userId: string
  type: '帰省'
  startDate: Date
  endDate: Date
  status: SubmissionStatus
  reason: string
  specialReason?: string
  rejectReason?: string
  locationId: string
  createdAt: Date
  mealsOff: MealOff[]
}
export interface MealAbsenceSubmission {
  id: string
  userId: string
  type: '欠食'
  status: SubmissionStatus
  reason: string
  specialReason?: string
  rejectReason?: string
  createdAt: Date
  mealsOff: MealOff[]
}

export type Submission = HomecomingSubmission | MealAbsenceSubmission
