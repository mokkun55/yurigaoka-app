'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import InputLabel from '@/_components/ui/input-label'
import { BaseInput } from '@/_components/ui/input/base-input'
import { BaseSelect } from '@/_components/ui/input/base-select'
import SectionTitle from '@/_components/ui/section-title'
import { Button } from '@/_components/ui/button'
import toast from 'react-hot-toast'
import { registerUser, verifyInvitationCode } from './actions'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useTransition } from 'react'
import LoadingSpinner from '@/_components/ui/loading-spinner'

// Zodスキーマ定義
const invitationCodeSchema = z.object({
  invitationCode: z
    .string()
    .length(7, '招待コードは7桁で入力してください')
    .regex(/^[A-Z0-9]+$/, '招待コードは英数字のみで入力してください'),
})

const userFormSchema = z.object({
  name: z
    .string()
    .min(1, '氏名を入力してください')
    .regex(/^[^\s ]+$/, '名字と名前の間に空白を入れずに入力してください'),
  gradeName: z.string().min(1, '学年を選択してください'),
  className: z.string().min(1, 'クラスを選択してください'),
  club: z.enum(['ソフトテニス部', 'サッカー部', 'none']).optional(),
  roomNumber: z
    .string()
    .length(4, '部屋番号は4桁で入力してください')
    .regex(/^\d+$/, '部屋番号は数字で入力してください'),
  parentName: z
    .string()
    .min(1, '保護者氏名を入力してください')
    .regex(/^[^\s ]+$/, '名字と名前の間に空白を入れずに入力してください'),
  homeAddressName: z.string().min(1, '登録名を入力してください'),
  homeAddressAddress: z.string().min(1, '住所を入力してください'),
  emergencyTel: z.string().regex(/^[0-9]{10,11}$/, '電話番号はハイフンなしの10桁または11桁で入力してください'),
})

// フォームの型定義
export type InvitationCodeValues = z.infer<typeof invitationCodeSchema>
export type UserFormValues = z.infer<typeof userFormSchema>

export default function RegisterPage() {
  const router = useRouter()

  // 寮生認証のフラグ
  const [isAuth, setIsAuth] = useState(false)

  const {
    control: invitationCodeControl,
    handleSubmit: handleInvitationCodeSubmit,
    formState: { errors: invitationCodeErrors },
  } = useForm<InvitationCodeValues>({
    resolver: zodResolver(invitationCodeSchema),
    defaultValues: { invitationCode: '' },
  })

  const {
    control: userFormControl,
    handleSubmit: handleUserFormSubmit,
    watch,
    setValue,
    formState: { errors: userFormErrors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      gradeName: '',
      className: '',
      club: undefined,
      roomNumber: '',
      parentName: '',
      homeAddressName: '',
      homeAddressAddress: '',
      emergencyTel: '',
    },
  })

  const watchedGradeName = watch('gradeName')

  useEffect(() => {
    setValue('className', '')
  }, [watchedGradeName, setValue])

  const getClassOptions = (year: string | undefined) => {
    switch (year) {
      case '1':
      case '2':
        return [
          { label: '1組', value: '1' },
          { label: '2組', value: '2' },
          { label: '3組', value: '3' },
          { label: '4組', value: '4' },
          { label: '5組', value: '5' },
        ]
      case '3':
      case '4':
      case '5':
        return [
          { label: 'I組', value: 'I' },
          { label: 'M組', value: 'M' },
          { label: 'E組', value: 'E' },
          { label: 'CA組', value: 'CA' },
        ]
      default:
        return []
    }
  }

  const [isPending, startTransition] = useTransition()
  const [isVerifying, startVerifyingTransition] = useTransition()

  const onInvitationCodeSubmit: SubmitHandler<InvitationCodeValues> = (data) => {
    startVerifyingTransition(async () => {
      try {
        await verifyInvitationCode(data)
        toast.success('認証に成功しました')
        setIsAuth(true)
      } catch (error: unknown) {
        if (error instanceof Error && error.message === '招待コードが無効です') {
          toast.error(error.message)
        } else {
          toast.error('認証に失敗しました')
        }
        console.error('認証に失敗しました', error)
      }
    })
  }

  const onUserFormSubmit: SubmitHandler<UserFormValues> = (data) => {
    startTransition(async () => {
      try {
        await registerUser(data)
        toast.success('ユーザー情報を登録しました')
        Cookies.set('is_registered', 'true')
        await router.push('/')
      } catch (error) {
        toast.error('ユーザー情報の登録に失敗しました')
        console.error('ユーザー情報の登録に失敗しました', error)
      }
    })
  }

  if (!isAuth) {
    return (
      <div className="flex flex-col gap-4 w-full content-center justify-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">寮生認証が必要です</h1>
          <p className="text-(--sub-text)">
            先生から伝えられた
            <br />
            招待コードを入力してください
          </p>
        </div>

        <form onSubmit={handleInvitationCodeSubmit(onInvitationCodeSubmit)} className="flex flex-col gap-4 mx-12">
          <InputLabel label="招待コード">
            <Controller
              name="invitationCode"
              control={invitationCodeControl}
              // cspell:disable-next-line
              render={({ field }) => <BaseInput {...field} placeholder="例: JJXRUJN6" fullWidth />}
            />
            {invitationCodeErrors.invitationCode && (
              <p className="text-red-500 text-sm mt-1">{invitationCodeErrors.invitationCode.message}</p>
            )}
          </InputLabel>
          <Button type="submit" disabled={isVerifying}>
            {isVerifying ? <LoadingSpinner size={20} /> : '認証する'}
          </Button>
        </form>
      </div>
    )
  }

  if (isAuth) {
    return (
      <div className="w-full h-full flex flex-col ">
        {/* ヘッダー */}
        <div className="flex flex-col gap-1 text-center my-3">
          <h1 className="text-2xl font-bold">ようこそ百合が丘サポートへ</h1>
          <p className="text-(--sub-text)">はじめに初期設定をしてください</p>
        </div>

        <form onSubmit={handleUserFormSubmit(onUserFormSubmit)}>
          <div className="mb-4">
            <SectionTitle title="あなたの情報" />
            <div className="flex flex-col gap-4">
              <InputLabel label="氏名">
                <Controller
                  name="name"
                  control={userFormControl}
                  render={({ field }) => <BaseInput {...field} placeholder="例: 高専太郎" fullWidth />}
                />
                {userFormErrors.name && <p className="text-red-500 text-sm mt-1">{userFormErrors.name.message}</p>}
              </InputLabel>
              <InputLabel label="学年・クラス">
                <div className="flex w-full items-start gap-2">
                  <div className="w-full">
                    <Controller
                      name="gradeName"
                      control={userFormControl}
                      render={({ field }) => (
                        <BaseSelect
                          {...field}
                          placeholder="学年"
                          options={[
                            { label: '1年生', value: '1' },
                            { label: '2年生', value: '2' },
                            { label: '3年生', value: '3' },
                            { label: '4年生', value: '4' },
                            { label: '5年生', value: '5' },
                          ]}
                          className="w-full"
                        />
                      )}
                    />
                    {userFormErrors.gradeName && (
                      <p className="text-red-500 text-sm mt-1">{userFormErrors.gradeName.message}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <Controller
                      name="className"
                      control={userFormControl}
                      render={({ field }) => (
                        <BaseSelect
                          {...field}
                          placeholder="クラス"
                          options={getClassOptions(watchedGradeName)}
                          disabled={!watchedGradeName || watchedGradeName === 'leader'}
                          className="w-full"
                        />
                      )}
                    />
                    {userFormErrors.className && (
                      <p className="text-red-500 text-sm mt-1">{userFormErrors.className.message}</p>
                    )}
                  </div>
                </div>
              </InputLabel>
              <InputLabel label="部活（任意）">
                <Controller
                  name="club"
                  control={userFormControl}
                  render={({ field }) => (
                    <BaseSelect
                      {...field}
                      placeholder="部活を選択"
                      options={[
                        { label: 'ソフトテニス部', value: 'ソフトテニス部' },
                        { label: 'サッカー部', value: 'サッカー部' },
                        { label: 'それ以外 または 未所属', value: 'none' },
                      ]}
                      className="w-full"
                    />
                  )}
                />
              </InputLabel>
              <InputLabel label="部屋番号">
                <Controller
                  name="roomNumber"
                  control={userFormControl}
                  render={({ field }) => <BaseInput {...field} placeholder="例: 2001" type="number" fullWidth />}
                />
                {userFormErrors.roomNumber && (
                  <p className="text-red-500 text-sm mt-1">{userFormErrors.roomNumber.message}</p>
                )}
              </InputLabel>
              <InputLabel label="保護者氏名">
                <Controller
                  name="parentName"
                  control={userFormControl}
                  render={({ field }) => <BaseInput {...field} placeholder="例: 高専花子" fullWidth />}
                />
                {userFormErrors.parentName && (
                  <p className="text-red-500 text-sm mt-1">{userFormErrors.parentName.message}</p>
                )}
              </InputLabel>
              <InputLabel label="緊急連絡先">
                <Controller
                  name="emergencyTel"
                  control={userFormControl}
                  render={({ field }) => <BaseInput {...field} placeholder="例: 09012345678" type="tel" fullWidth />}
                />
                {userFormErrors.emergencyTel && (
                  <p className="text-red-500 text-sm mt-1">{userFormErrors.emergencyTel.message}</p>
                )}
              </InputLabel>
            </div>
          </div>

          <div>
            <SectionTitle title="帰省先の情報" />
            <p className="text-(--sub-text) text-sm mb-4">
              よく使う帰省先(実家など)を登録してください。 後から編集できます。
            </p>
            <div className="flex flex-col gap-4">
              <InputLabel label="登録名">
                <Controller
                  name="homeAddressName"
                  control={userFormControl}
                  render={({ field }) => <BaseInput {...field} placeholder="例: 実家" fullWidth />}
                />
                {userFormErrors.homeAddressName && (
                  <p className="text-red-500 text-sm mt-1">{userFormErrors.homeAddressName.message}</p>
                )}
              </InputLabel>
              <InputLabel label="住所">
                <Controller
                  name="homeAddressAddress"
                  control={userFormControl}
                  render={({ field }) => (
                    <BaseInput {...field} placeholder="例: 三重県名張市春日丘７番町１" fullWidth />
                  )}
                />
                {userFormErrors.homeAddressAddress && (
                  <p className="text-red-500 text-sm mt-1">{userFormErrors.homeAddressAddress.message}</p>
                )}
              </InputLabel>
            </div>
          </div>

          <Button className="w-full mt-6" type="submit" disabled={isPending}>
            {isPending ? <LoadingSpinner size={20} /> : '登録する'}
          </Button>
        </form>
      </div>
    )
  }
}
