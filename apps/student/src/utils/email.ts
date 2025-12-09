import nodemailer from 'nodemailer'
import { fetchUserOperation } from '@/firestore/user-operations'
import dayjs from 'dayjs'

// 欠食状況を確認画面と同じ形式で表示する関数
function formatMealStatus(
  mealsOff: Array<{ date: Date; breakfast: boolean; dinner: boolean }>,
  targetDate: Date,
  isStartDate: boolean
): string {
  const mealEntry = mealsOff.find((meal) => dayjs(meal.date).isSame(dayjs(targetDate), 'day'))

  if (!mealEntry) {
    return '朝食: 喫食 ／ 夕食: 喫食'
  }

  // 確認画面の表示ロジックに合わせる
  // 開始日の場合:
  // - breakfast=true, dinner=true → '朝食: 欠食 ／ 夕食: 欠食'
  // - breakfast=true, dinner=false → '朝食: 欠食 ／ 夕食: 欠食' (meal_start='breakfast'の場合)
  // - breakfast=false, dinner=true → '朝食: 喫食 ／ 夕食: 欠食' (meal_start='dinner'の場合)
  // 終了日の場合:
  // - breakfast=true, dinner=false → '朝食: 欠食 ／ 夕食: 喫食' (meal_end='breakfast'の場合)
  // - breakfast=false, dinner=true → '朝食: 欠食 ／ 夕食: 欠食' (meal_end='dinner'の場合)

  if (isStartDate) {
    // 開始日: breakfast=trueかつdinner=true → '朝食: 欠食 ／ 夕食: 欠食'
    // breakfast=trueかつdinner=false → '朝食: 欠食 ／ 夕食: 欠食' (meal_start='breakfast'の場合、実際にはdinnerもtrueになる)
    // breakfast=falseかつdinner=true → '朝食: 喫食 ／ 夕食: 欠食'
    if (mealEntry.breakfast && mealEntry.dinner) {
      return '朝食: 欠食 ／ 夕食: 欠食'
    }
    if (mealEntry.breakfast) {
      return '朝食: 欠食 ／ 夕食: 欠食'
    }
    if (mealEntry.dinner) {
      return '朝食: 喫食 ／ 夕食: 欠食'
    }
    return '朝食: 喫食 ／ 夕食: 喫食'
  } else {
    // 終了日: breakfast=trueかつdinner=false → '朝食: 欠食 ／ 夕食: 喫食'
    // breakfast=falseかつdinner=true → '朝食: 欠食 ／ 夕食: 欠食'
    if (mealEntry.breakfast && !mealEntry.dinner) {
      return '朝食: 欠食 ／ 夕食: 喫食'
    }
    if (mealEntry.breakfast && mealEntry.dinner) {
      return '朝食: 欠食 ／ 夕食: 欠食'
    }
    if (mealEntry.dinner) {
      return '朝食: 欠食 ／ 夕食: 欠食'
    }
    return '朝食: 喫食 ／ 夕食: 喫食'
  }
}

// メール送信関数
export async function sendNotificationEmail(
  userId: string,
  submissionType: '帰省' | '欠食',
  submissionData: {
    startDate?: Date
    endDate?: Date
    reason?: string
    specialReason?: string
    mealsOff?: Array<{ date: Date; breakfast: boolean; dinner: boolean }>
  }
) {
  // 環境変数の確認
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  const recipientEmail = process.env.NOTIFICATION_RECIPIENT_EMAIL

  if (!smtpUser || !smtpPassword) {
    throw new Error('SMTP設定が不完全です。SMTP_USERとSMTP_PASSWORDを設定してください。')
  }

  if (!recipientEmail) {
    throw new Error('送信先メールアドレスが設定されていません。NOTIFICATION_RECIPIENT_EMAILを設定してください。')
  }

  // ユーザー情報を取得
  const user = await fetchUserOperation(userId)
  if (!user) {
    throw new Error('ユーザーが見つかりません')
  }

  // Gmail SMTP設定
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  })

  // メール本文を作成
  let emailSubject = ''
  let emailBody = ''

  if (submissionType === '帰省') {
    emailSubject = `【届け出通知】${user.name}さんから帰省届が提出されました`

    // 欠食状況を取得
    const mealsOff = submissionData.mealsOff || []
    const startDateMealStatus = submissionData.startDate
      ? formatMealStatus(mealsOff, submissionData.startDate, true)
      : '朝食: 喫食 ／ 夕食: 喫食'
    const endDateMealStatus = submissionData.endDate
      ? formatMealStatus(mealsOff, submissionData.endDate, false)
      : '朝食: 喫食 ／ 夕食: 喫食'

    emailBody = `
${user.name}さんから帰省届が提出されました。

【提出内容】
種類: 帰省届
開始日: ${submissionData.startDate ? dayjs(submissionData.startDate).format('YYYY年MM月DD日 HH:mm') : '未設定'}
終了日: ${submissionData.endDate ? dayjs(submissionData.endDate).format('YYYY年MM月DD日 HH:mm') : '未設定'}
理由: ${submissionData.reason || '未記入'}
${submissionData.specialReason ? `特別な事情: ${submissionData.specialReason}` : ''}

【欠食状況】
帰省日（${submissionData.startDate ? dayjs(submissionData.startDate).format('YYYY年MM月DD日') : '未設定'}）の食事: ${startDateMealStatus}
帰寮日（${submissionData.endDate ? dayjs(submissionData.endDate).format('YYYY年MM月DD日') : '未設定'}）の食事: ${endDateMealStatus}

システムで確認をお願いします。
    `.trim()
  } else if (submissionType === '欠食') {
    emailSubject = `【届け出通知】${user.name}さんから欠食届が提出されました`

    // 欠食状況を取得
    const mealsOff = submissionData.mealsOff || []
    const isOneDay =
      submissionData.startDate && submissionData.endDate
        ? dayjs(submissionData.startDate).isSame(dayjs(submissionData.endDate), 'day')
        : false

    let mealStatusText = ''
    if (isOneDay && mealsOff.length > 0) {
      // 1日の場合
      const mealEntry = mealsOff[0]
      if (mealEntry.breakfast && mealEntry.dinner) {
        mealStatusText = '朝食: 欠食 ／ 夕食: 欠食'
      } else if (mealEntry.breakfast) {
        mealStatusText = '朝食: 欠食 ／ 夕食: 喫食'
      } else if (mealEntry.dinner) {
        mealStatusText = '朝食: 喫食 ／ 夕食: 欠食'
      } else {
        mealStatusText = '朝食: 喫食 ／ 夕食: 喫食'
      }
    } else {
      // 複数日の場合
      const startDateMealStatus = submissionData.startDate
        ? formatMealStatus(mealsOff, submissionData.startDate, true)
        : '朝食: 喫食 ／ 夕食: 喫食'
      const endDateMealStatus = submissionData.endDate
        ? formatMealStatus(mealsOff, submissionData.endDate, false)
        : '朝食: 喫食 ／ 夕食: 喫食'

      mealStatusText = `開始日（${submissionData.startDate ? dayjs(submissionData.startDate).format('YYYY年MM月DD日') : '未設定'}）の食事: ${startDateMealStatus}
終了日（${submissionData.endDate ? dayjs(submissionData.endDate).format('YYYY年MM月DD日') : '未設定'}）の食事: ${endDateMealStatus}`
    }

    emailBody = `
${user.name}さんから欠食届が提出されました。

【提出内容】
種類: 欠食届
開始日: ${submissionData.startDate ? dayjs(submissionData.startDate).format('YYYY年MM月DD日') : '未設定'}
終了日: ${submissionData.endDate ? dayjs(submissionData.endDate).format('YYYY年MM月DD日') : '未設定'}
理由: ${submissionData.reason || '未記入'}

【欠食状況】
${isOneDay ? `欠食する食事: ${mealStatusText}` : mealStatusText}

システムで確認をお願いします。
    `.trim()
  }

  // メール送信
  const mailOptions = {
    from: smtpUser,
    to: recipientEmail,
    subject: emailSubject,
    text: emailBody,
  }

  await transporter.sendMail(mailOptions)
}
