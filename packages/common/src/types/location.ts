import { Timestamp } from 'firebase-admin/firestore'

export type Location = {
  id: string
  name: string
  address: string
  phoneNumber: string
  parentName: string
  createdAt: Date
}

export type LocationData = {
  name: string
  address: string
  phoneNumber: string
  parentName: string
  createdAt: Timestamp
}
