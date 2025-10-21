import { Timestamp } from 'firebase-admin/firestore'

export type Location = {
  id: string
  name: string
  address: string
  createdAt: Date
}

export type LocationData = {
  name: string
  address: string
  createdAt: Timestamp
}
