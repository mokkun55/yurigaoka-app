import * as admin from 'firebase-admin'

// エミュレーターに接続
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'

// Firebase Admin SDKの初期化（エミュレーター用のダミープロジェクトID）
admin.initializeApp({
  // どうにかしてプロジェクトIDを取得する
  projectId: 'yurigaoka-app-develop',
})

/**
 * エミュレーター用のシードデータを投入
 */
async function seedData() {
  const db = admin.firestore()

  console.log('🌱 シードデータの投入を開始します...')

  try {
    // === teacherWhitelistのシードデータ ===
    console.log('📝 teacherWhitelistコレクションにデータを追加中...')

    await db.collection('teacherWhitelist').doc('test-teacher-1').set({
      email: 'teacher001@ktc.ac.jp',
      role: 'teacher',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    await db.collection('teacherWhitelist').doc('test-teacher-2').set({
      email: 'teacher002@ktc.ac.jp',
      role: 'teacher',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    await db.collection('teacherWhitelist').doc('test-manager-1').set({
      email: 'g00001@ktc.ac.jp',
      role: 'manager',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log(`  ✓ teacherWhitelistデータを3件追加しました`)

    // === inviteCodesコレクションのシードデータ ===
    console.log('🎫 inviteCodesコレクションにデータを追加中...')

    const now = new Date()
    const limitDate = new Date(now)
    limitDate.setMonth(limitDate.getMonth() + 3) // 3ヶ月後
    const lastWeek = new Date(now)
    lastWeek.setDate(lastWeek.getDate() - 7)

    await db.collection('inviteCodes').add({
      code: 'TEST123',
      useCount: 0,
      limitDate: admin.firestore.Timestamp.fromDate(limitDate),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    await db.collection('inviteCodes').add({
      code: 'EXPIRED9999',
      useCount: 0,
      limitDate: admin.firestore.Timestamp.fromDate(lastWeek), // 期限切れ
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log(`  ✓ 招待コードデータを3件追加しました`)

    console.log('🎉 シードデータの投入が完了しました！')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  }
}

// スクリプトの実行
seedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ シードデータの投入に失敗しました:', error)
    process.exit(1)
  })
