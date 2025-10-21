import { Timestamp } from 'firebase-admin/firestore'

export type InviteCode = {
  id: string
  code: string
  useCount: number
  createdAt: Date
  limitDate: Date
}

export type InviteCodeData = {
  code: string
  useCount: number
  createdAt: Timestamp
  limitDate: Date
}
