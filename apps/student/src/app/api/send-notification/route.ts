import { NextRequest, NextResponse } from 'next/server'
import { sendNotificationEmail } from '@/utils/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, submissionType, submissionData } = body

    // バリデーション
    if (!userId || !submissionType || !submissionData) {
      return NextResponse.json({ error: '必要なパラメータが不足しています' }, { status: 400 })
    }

    // メール送信
    await sendNotificationEmail(userId, submissionType, submissionData)

    return NextResponse.json({ success: true, message: 'メールを送信しました' }, { status: 200 })
  } catch (error) {
    console.error('メール送信エラー:', error)
    const errorMessage = error instanceof Error ? error.message : 'メール送信に失敗しました'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
