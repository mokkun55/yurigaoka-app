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
  const auth = admin.auth()

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

    // === Authユーザーの作成 ===
    console.log('👤 Authユーザーを作成中...')

    // 教員ユーザー
    try {
      await auth.createUser({
        uid: 'test-teacher-001',
        email: 'teacher001@ktc.ac.jp',
        password: 'password123',
        displayName: 'テスト教員1',
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('auth/email-already-exists')) {
        console.log('  ℹ テスト教員1は既に存在します')
      } else {
        throw error
      }
    }

    try {
      await auth.createUser({
        uid: 'test-teacher-002',
        email: 'teacher002@ktc.ac.jp',
        password: 'password123',
        displayName: 'テスト教員2',
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('auth/email-already-exists')) {
        console.log('  ℹ テスト教員2は既に存在します')
      } else {
        throw error
      }
    }

    // 学生ユーザー
    try {
      await auth.createUser({
        uid: 'test-manager-001',
        email: 'g00001@ktc.ac.jp',
        password: 'password123',
        displayName: 'テスト寮長',
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('auth/email-already-exists')) {
        console.log('  ℹ テスト寮長は既に存在します')
      } else {
        throw error
      }
    }

    try {
      await auth.createUser({
        uid: 'test-student-001',
        email: 'g00002@ktc.ac.jp',
        password: 'password123',
        displayName: 'テスト学生1',
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('auth/email-already-exists')) {
        console.log('  ℹ テスト学生1は既に存在します')
      } else {
        throw error
      }
    }

    try {
      await auth.createUser({
        uid: 'test-student-002',
        email: 'g00003@ktc.ac.jp',
        password: 'password123',
        displayName: 'テスト学生2',
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('auth/email-already-exists')) {
        console.log('  ℹ テスト学生2は既に存在します')
      } else {
        throw error
      }
    }

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
