'use server'

import {
  createInviteCode,
  fetchAllInviteCodes,
  deleteInviteCode,
  generateInviteCode,
} from '@/firestore/invite-code-operations'
import { revalidatePath } from 'next/cache'

// すべての招待コードを取得
export async function getAllInviteCodes() {
  try {
    const codes = await fetchAllInviteCodes()
    // 有効なコードのみ返す（limitDateが現在より未来のもの）
    const now = new Date()
    return codes.filter((code) => code.limitDate > now)
  } catch (error) {
    console.error('Failed to fetch invite codes:', error)
    throw error
  }
}

// 新しい招待コードを作成
export async function createNewInviteCode(validityPeriod: '1日' | '3日' | '7日') {
  try {
    const code = generateInviteCode()
    const now = new Date()

    // 有効期限を計算（日数に応じて）
    let days = 1
    if (validityPeriod === '3日') {
      days = 3
    } else if (validityPeriod === '7日') {
      days = 7
    }

    const limitDate = new Date(now)
    limitDate.setDate(limitDate.getDate() + days)
    limitDate.setHours(23, 59, 59, 999) // 23:59:59に設定

    await createInviteCode({
      code,
      useCount: 0,
      createdAt: now,
      limitDate,
    })

    revalidatePath('/code')
    return { success: true, code }
  } catch (error) {
    console.error('Failed to create invite code:', error)
    throw error
  }
}

// 招待コードを削除
export async function removeInviteCode(codeId: string) {
  try {
    await deleteInviteCode(codeId)
    revalidatePath('/code')
  } catch (error) {
    console.error('Failed to delete invite code:', error)
    throw error
  }
}
