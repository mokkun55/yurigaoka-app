import { Location } from './location'

// サーバー、クライアント共通の型定義
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
  locations?: Location[]
}
