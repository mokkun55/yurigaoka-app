'use server'

import { adminDb, adminAuth } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'
import { fetchLocationsByUser, createLocation, updateLocation, deleteLocation } from '@/firestore/location-operations'

function getSessionCookieName(): string {
  const cookieName = process.env.SESSION_COOKIE_NAME
  if (!cookieName) {
    throw new Error('環境変数 SESSION_COOKIE_NAME が設定されていません')
  }
  return cookieName
}

// セッションCookieからuidを取得
async function getUidFromSession(): Promise<string | null> {
  try {
    const cookieName = getSessionCookieName()
    const sessionCookie = (await cookies()).get(cookieName)?.value

    if (!sessionCookie) {
      return null
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    return decodedClaims.uid || null
  } catch (error) {
    console.error('セッション検証エラー:', error)
    return null
  }
}

export type UserSettingsData = {
  grade: string
  class: string
  roomNumber: string
  parentName: string
}

export type PresetData = {
  id?: string
  name: string
  address: string
}

// ユーザー設定データを取得
export async function getUserSettings() {
  const uid = await getUidFromSession()
  if (!uid) {
    throw new Error('認証されていません')
  }

  return getUserSettingsByUid(uid)
}

async function getUserSettingsByUid(uid: string) {
  try {
    // Firestoreから直接データを取得してparentNameを含める
    const userDoc = await adminDb.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      throw new Error('ユーザーが見つかりません')
    }

    const userData = userDoc.data()
    if (!userData) {
      throw new Error('ユーザーデータが見つかりません')
    }

    const locations = await fetchLocationsByUser(uid)

    // LocationをPreset形式に変換
    const presets: PresetData[] = locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
    }))

    return {
      grade: userData.grade || '',
      class: userData.class || '',
      roomNumber: userData.roomNumber || '',
      parentName: userData.parentName || '',
      presets,
    }
  } catch (error) {
    console.error('Failed to fetch user settings:', error)
    throw error
  }
}

// ユーザー設定データを保存
export async function updateUserSettings(data: UserSettingsData, presets: PresetData[]) {
  const uid = await getUidFromSession()
  if (!uid) {
    throw new Error('認証されていません')
  }

  return updateUserSettingsByUid(uid, data, presets)
}

async function updateUserSettingsByUid(uid: string, data: UserSettingsData, presets: PresetData[]) {
  try {
    // ユーザー情報を更新
    await adminDb.collection('users').doc(uid).update({
      grade: data.grade,
      class: data.class,
      roomNumber: data.roomNumber,
      parentName: data.parentName,
    })

    // 既存のロケーションを取得
    const existingLocations = await fetchLocationsByUser(uid)
    const existingLocationIds = new Set(existingLocations.map((loc) => loc.id))

    // プリセットを処理
    const presetIds = new Set(presets.filter((p) => p.id).map((p) => p.id!))
    const locationsToDelete = existingLocations.filter((loc) => !presetIds.has(loc.id))

    // 削除するロケーションを削除
    for (const location of locationsToDelete) {
      await deleteLocation(location.id)
    }

    // 更新または作成するロケーションを処理
    for (const preset of presets) {
      if (preset.id && existingLocationIds.has(preset.id)) {
        // 既存のロケーションを更新
        await updateLocation(preset.id, {
          name: preset.name,
          address: preset.address,
        })
      } else {
        // 新しいロケーションを作成
        await createLocation({
          name: preset.name,
          address: preset.address,
          createdAt: new Date(),
          userId: uid,
        })
      }
    }
  } catch (error) {
    console.error('Failed to update user settings:', error)
    throw error
  }
}
