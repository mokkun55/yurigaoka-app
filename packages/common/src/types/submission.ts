import { Timestamp } from 'firebase-admin/firestore'

export interface MealOff {
  date: Date
  breakfast: boolean
  dinner: boolean
}

export interface MealOffData {
  date: string
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
  locationId: string
  createdAt: Date
  mealsOff: MealOff[]
}

export interface HomecomingSubmissionData {
  userId: string
  type: '帰省'
  startDate: string
  endDate: string
  status: SubmissionStatus
  reason: string
  specialReason?: string
  locationId: string
  createdAt: Timestamp
  mealsOff: MealOffData[]
}

export interface MealAbsenceSubmission {
  id: string
  userId: string
  type: '欠食'
  status: SubmissionStatus
  reason: string
  specialReason?: string
  createdAt: Date
  mealsOff: MealOff[]
}

export interface MealAbsenceSubmissionData {
  userId: string
  type: '欠食'
  status: SubmissionStatus
  reason: string
  specialReason?: string
  createdAt: Timestamp
  mealsOff: MealOffData[]
}

export type Submission = HomecomingSubmission | MealAbsenceSubmission

export type SubmissionData = HomecomingSubmissionData | MealAbsenceSubmissionData
