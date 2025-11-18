'use server'

import { getSystemConfig, updateSystemConfig } from '@/firestore/system-config-operations'
import type { SystemConfig } from '@yurigaoka-app/common'

/**
 * システム設定を取得
 */
export async function fetchSystemConfig(): Promise<SystemConfig> {
  return await getSystemConfig()
}

/**
 * システム設定を更新
 */
export async function saveSystemConfig(config: SystemConfig): Promise<void> {
  await updateSystemConfig(config)
}
