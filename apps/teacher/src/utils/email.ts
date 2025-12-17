import nodemailer from 'nodemailer'
import { fetchStudentById } from '@/firestore/user-operations'
import { fetchSubmissionById } from '@/firestore/submission-operations'
import { HomecomingSubmission, MealAbsenceSubmission } from '@yurigaoka-app/common'
import dayjs from 'dayjs'

// メール送信関数（承認通知）
export async function sendApprovalEmail(submissionId: string): Promise<void> {
  // 環境変数の確認
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD

  if (!smtpUser || !smtpPassword) {
    throw new Error('SMTP設定が不完全です。SMTP_USERとSMTP_PASSWORDを設定してください。')
  }

  // 申請情報を取得
  const submission = await fetchSubmissionById(submissionId)
  if (!submission) {
    throw new Error('申請が見つかりません')
  }

  // ユーザー情報を取得
  const user = await fetchStudentById(submission.userId)
  if (!user) {
    throw new Error('ユーザーが見つかりません')
  }

  if (!user.email) {
    throw new Error('ユーザーのメールアドレスが設定されていません')
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

  if (submission.type === '帰省') {
    const homecomingSubmission = submission as HomecomingSubmission
    emailSubject = `【届け出承認】帰省届が承認されました`

    emailBody = `
${user.name}さん

帰省届が承認されました。

【申請内容】
種類: 帰省届
開始日: ${dayjs(homecomingSubmission.startDate).format('YYYY年MM月DD日 HH:mm')}
終了日: ${dayjs(homecomingSubmission.endDate).format('YYYY年MM月DD日 HH:mm')}
理由: ${homecomingSubmission.reason || '未記入'}
${homecomingSubmission.specialReason ? `特別な事情: ${homecomingSubmission.specialReason}` : ''}

システムで確認をお願いします。
    `.trim()
  } else if (submission.type === '欠食') {
    const mealAbsenceSubmission = submission as MealAbsenceSubmission
    emailSubject = `【届け出承認】欠食届が承認されました`

    // mealsOffから開始日と終了日を取得
    let startDate = '未設定'
    let endDate = '未設定'
    if (mealAbsenceSubmission.mealsOff.length > 0) {
      const sortedMealsOff = [...mealAbsenceSubmission.mealsOff].sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      const firstDate = sortedMealsOff[0].date
      const lastDate = sortedMealsOff[sortedMealsOff.length - 1].date
      startDate = dayjs(firstDate).format('YYYY年MM月DD日')
      endDate = dayjs(lastDate).format('YYYY年MM月DD日')
    }

    emailBody = `
${user.name}さん

欠食届が承認されました。

【申請内容】
種類: 欠食届
開始日: ${startDate}
終了日: ${endDate}
理由: ${mealAbsenceSubmission.reason || '未記入'}

システムで確認をお願いします。
    `.trim()
  }

  // メール送信
  const mailOptions = {
    from: '帰省届管理ツール <mokkunpc@gmai.com>',
    to: user.email,
    subject: emailSubject,
    text: emailBody,
  }

  await transporter.sendMail(mailOptions)
}

// メール送信関数（却下通知）
export async function sendRejectionEmail(submissionId: string, rejectReason: string): Promise<void> {
  // 環境変数の確認
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD

  if (!smtpUser || !smtpPassword) {
    throw new Error('SMTP設定が不完全です。SMTP_USERとSMTP_PASSWORDを設定してください。')
  }

  // 申請情報を取得
  const submission = await fetchSubmissionById(submissionId)
  if (!submission) {
    throw new Error('申請が見つかりません')
  }

  // ユーザー情報を取得
  const user = await fetchStudentById(submission.userId)
  if (!user) {
    throw new Error('ユーザーが見つかりません')
  }

  if (!user.email) {
    throw new Error('ユーザーのメールアドレスが設定されていません')
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

  if (submission.type === '帰省') {
    const homecomingSubmission = submission as HomecomingSubmission
    emailSubject = `【届け出却下】帰省届が却下されました`

    emailBody = `
${user.name}さん

帰省届が却下されました。

【申請内容】
種類: 帰省届
開始日: ${dayjs(homecomingSubmission.startDate).format('YYYY年MM月DD日 HH:mm')}
終了日: ${dayjs(homecomingSubmission.endDate).format('YYYY年MM月DD日 HH:mm')}
理由: ${homecomingSubmission.reason || '未記入'}
${homecomingSubmission.specialReason ? `特別な事情: ${homecomingSubmission.specialReason}` : ''}

【却下理由】
${rejectReason}

内容を確認し、必要に応じて再申請をお願いします。
    `.trim()
  } else if (submission.type === '欠食') {
    const mealAbsenceSubmission = submission as MealAbsenceSubmission
    emailSubject = `【届け出却下】欠食届が却下されました`

    // mealsOffから開始日と終了日を取得
    let startDate = '未設定'
    let endDate = '未設定'
    if (mealAbsenceSubmission.mealsOff.length > 0) {
      const sortedMealsOff = [...mealAbsenceSubmission.mealsOff].sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      const firstDate = sortedMealsOff[0].date
      const lastDate = sortedMealsOff[sortedMealsOff.length - 1].date
      startDate = dayjs(firstDate).format('YYYY年MM月DD日')
      endDate = dayjs(lastDate).format('YYYY年MM月DD日')
    }

    emailBody = `
${user.name}さん

欠食届が却下されました。

【申請内容】
種類: 欠食届
開始日: ${startDate}
終了日: ${endDate}
理由: ${mealAbsenceSubmission.reason || '未記入'}

【却下理由】
${rejectReason}

内容を確認し、必要に応じて再申請をお願いします。
    `.trim()
  }

  // メール送信
  const mailOptions = {
    from: '帰省届管理ツール <mokkunpc@gmai.com>',
    to: user.email,
    subject: emailSubject,
    text: emailBody,
  }

  await transporter.sendMail(mailOptions)
}
