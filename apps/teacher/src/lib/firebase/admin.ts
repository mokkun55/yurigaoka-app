import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// エミュレータ使用時の設定
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'

if (!getApps().length) {
  if (useEmulator) {
    // エミュレータ使用時はダミーの認証情報でOK
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
    })

    // エミュレータのホストを設定
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  } else {
    // 本番環境では正式な認証情報を使用
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId) {
      throw new Error('環境変数 FIREBASE_PROJECT_ID が設定されていません')
    }
    if (!clientEmail) {
      throw new Error('環境変数 FIREBASE_CLIENT_EMAIL が設定されていません')
    }
    if (!privateKey) {
      throw new Error('環境変数 FIREBASE_PRIVATE_KEY が設定されていません')
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    })
  }
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
