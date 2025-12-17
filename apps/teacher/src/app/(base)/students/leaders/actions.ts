'use server'

import {
  fetchAllTeacherWhitelist,
  createTeacherWhitelist,
  deleteTeacherWhitelist,
  fetchTeacherWhitelistByEmail,
} from '@/firestore/teacher-whitelist-operations'
import { revalidatePath } from 'next/cache'

// すべての先生&寮長を取得
export async function getAllTeacherWhitelist() {
  try {
    return await fetchAllTeacherWhitelist()
  } catch (error) {
    console.error('Failed to fetch teacher whitelist:', error)
    throw error
  }
}

// 新しい先生&寮長を追加
export async function addTeacherWhitelist(email: string, role: 'teacher' | 'manager') {
  try {
    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('有効なメールアドレスを入力してください')
    }

    // 既に登録されているかチェック
    const existing = await fetchTeacherWhitelistByEmail(email)
    if (existing) {
      throw new Error('このメールアドレスは既に登録されています')
    }

    await createTeacherWhitelist(email, role)
    revalidatePath('/students/leaders')
  } catch (error) {
    console.error('Failed to create teacher whitelist:', error)
    throw error
  }
}

// 先生&寮長を削除
export async function removeTeacherWhitelist(id: string) {
  try {
    await deleteTeacherWhitelist(id)
    revalidatePath('/students/leaders')
  } catch (error) {
    console.error('Failed to delete teacher whitelist:', error)
    throw error
  }
}
