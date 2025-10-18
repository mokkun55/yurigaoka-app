'use client'

import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import InputLabel from '@/_components/ui/input-label'
import { Button } from '@/_components/ui/button'
import { CheckboxField } from '@/_components/ui/checkbox/checkbox-field'
import { useState } from 'react'
import { DateInput } from '@/_components/ui/input/date-input'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { submitMealForm } from './actions'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import ja from 'dayjs/locale/ja'
import ConfirmAbsenceDialog from '../_components/ConfirmAbsenceDialog'
import { formatDateWithWeekday } from '@/utils/dateUtils'
import { MealCheckboxGroup } from '@/_components/ui/checkbox/checkbox-field/MealCheckboxGroup'
dayjs.extend(weekday)
dayjs.locale(ja)

const mealFormSchema = z
  .object({
    startDate: z.string().min(1, '開始日を選択してください'),
    endDate: z.string().min(1, '終了日を選択してください'),
    start_meal: z.enum(['breakfast', 'dinner']).nullable(),
    end_meal: z.enum(['breakfast', 'dinner']).nullable(),
    reason: z.string().min(1, '理由を入力してください'),
    oneDayBreakfast: z.boolean().optional(),
    oneDayDinner: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // 開始日 <= 終了日
    if (new Date(data.startDate) > new Date(data.endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: '開始日は終了日より前または同じ日付を選択してください',
      })
    }

    // 3日前までに提出
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const threeDaysLater = new Date(today)
    threeDaysLater.setDate(today.getDate() + 3)
    if (new Date(data.startDate) < threeDaysLater) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: '欠食届は3日前までに提出してください',
      })
    }

    // 食事選択
    if (data.startDate === data.endDate) {
      // 1日の場合、どちらもfalse/undefinedならエラー
      if (!data.oneDayBreakfast && !data.oneDayDinner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['oneDayBreakfast'],
          message: 'いずれかの食事を選択してください',
        })
      }
    } else {
      if (!data.start_meal && !data.end_meal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['start_meal'],
          message: 'いずれかの食事を選択してください',
        })
      }
    }
  })

export type MealFormValues = z.infer<typeof mealFormSchema>

function getOneDayMealLabel(breakfast: boolean | undefined, dinner: boolean | undefined): string {
  if (breakfast && dinner) return '朝食: 欠食 ／ 夕食: 欠食'
  if (breakfast) return '朝食: 欠食 ／ 夕食: 喫食'
  if (dinner) return '朝食: 喫食 ／ 夕食: 欠食'
  return '朝食: 喫食 ／ 夕食: 喫食'
}

function getMealLabel(meal: 'breakfast' | 'dinner' | null | undefined): string {
  if (meal === 'breakfast') return '朝食: 欠食 ／ 夕食: 喫食'
  if (meal === 'dinner') return '朝食: 喫食 ／ 夕食: 欠食'
  return '朝食: 喫食 ／ 夕食: 喫食'
}

export default function Meal() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<MealFormValues | undefined>(undefined)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = dayjs().format('YYYY-MM-DD')

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      startDate: today,
      endDate: today,
      start_meal: null,
      end_meal: null,
      reason: '',
      oneDayBreakfast: false,
      oneDayDinner: false,
    },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const startMeal = watch('start_meal')
  const endMeal = watch('end_meal')
  const oneDayBreakfast = watch('oneDayBreakfast')
  const oneDayDinner = watch('oneDayDinner')
  const isOneDay = startDate === endDate

  const onConfirm = (data: MealFormValues) => {
    setFormValues(data)
    setIsConfirm(true)
  }

  const onSubmit: SubmitHandler<MealFormValues> = async (data) => {
    setIsSubmitting(true)
    // 送信データ整形
    let submitData: MealFormValues = { ...data }
    if (isOneDay) {
      // 1日の場合はstart_meal, end_mealは使わずoneDayBreakfast/oneDayDinnerを送る
      submitData = {
        ...data,
        start_meal: null,
        end_meal: null,
        oneDayBreakfast: data.oneDayBreakfast,
        oneDayDinner: data.oneDayDinner,
      }
    }
    try {
      await submitMealForm(submitData)
      toast.success('提出しました')
      router.push('/')
    } catch (e) {
      console.error(e)
      toast.error('提出に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConfirm) {
    return (
      <div className="bg-white h-full w-full max-w-screen overflow-x-hidden">
        <form onSubmit={handleSubmit(onConfirm)} className="flex flex-col gap-4 p-3">
          <div className="flex gap-2">
            <InputLabel label="開始日" className="w-full">
              <Controller name="startDate" control={control} render={({ field }) => <DateInput {...field} />} />
            </InputLabel>
            <InputLabel label="終了日" className="w-full">
              <Controller name="endDate" control={control} render={({ field }) => <DateInput {...field} />} />
            </InputLabel>
          </div>
          {(errors.startDate || errors.endDate) && (
            <div className="text-red-500 text-xs mt-1">{errors.startDate?.message || errors.endDate?.message}</div>
          )}
          {errors.root && typeof errors.root.message === 'string' && (
            <div className="text-red-500 text-xs mt-1">{errors.root.message}</div>
          )}
          {isOneDay ? (
            <InputLabel label="欠食する食事">
              <div className="flex gap-2">
                <CheckboxField
                  checked={oneDayBreakfast}
                  onCheckedChange={(checked) => setValue('oneDayBreakfast', checked)}
                  name="oneDayBreakfast"
                  label="朝食"
                />
                <CheckboxField
                  checked={oneDayDinner}
                  onCheckedChange={(checked) => setValue('oneDayDinner', checked)}
                  name="oneDayDinner"
                  label="夕食"
                />
              </div>
            </InputLabel>
          ) : (
            <>
              <InputLabel label={`開始日（${formatDateWithWeekday(startDate)}）の食事`}>
                <MealCheckboxGroup
                  value={startMeal}
                  onChange={(val) => setValue('start_meal', val as 'breakfast' | 'dinner' | null)}
                  options={[
                    { value: 'breakfast', label: '朝食から', name: 'startBreakfast' },
                    { value: 'dinner', label: '夕食から', name: 'startDinner' },
                    { value: null, label: '欠食しない', name: 'startNone' },
                  ]}
                />
              </InputLabel>
              <InputLabel label={`終了日（${formatDateWithWeekday(endDate)}）の食事`}>
                <MealCheckboxGroup
                  value={endMeal}
                  onChange={(val) => setValue('end_meal', val as 'breakfast' | 'dinner' | null)}
                  options={[
                    { value: 'breakfast', label: '朝食まで', name: 'endBreakfast' },
                    { value: 'dinner', label: '夕食まで', name: 'endDinner' },
                    { value: null, label: '欠食しない', name: 'endNone' },
                  ]}
                />
              </InputLabel>
            </>
          )}
          {isOneDay
            ? errors.oneDayBreakfast && (
                <div className="text-red-500 text-xs mt-1">{errors.oneDayBreakfast.message}</div>
              )
            : errors.start_meal && <div className="text-red-500 text-xs mt-1">{errors.start_meal.message}</div>}
          <InputLabel label="欠食理由">
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full border rounded p-2 min-h-[48px]"
                  placeholder="理由を入力してください"
                />
              )}
            />
            {errors.reason && <div className="text-red-500 text-xs mt-1">{errors.reason.message}</div>}
          </InputLabel>
          <Button className="w-full mt-4" type="submit">
            確認する
          </Button>
        </form>
      </div>
    )
  }

  if (isConfirm && formValues) {
    const isOneDay = formValues.startDate === formValues.endDate
    const periodValue = isOneDay ? (
      formatDateWithWeekday(formValues.startDate)
    ) : (
      <>
        <span>{formatDateWithWeekday(formValues.startDate)}</span>
        <span className="mx-2">〜</span>
        <span>{formatDateWithWeekday(formValues.endDate)}</span>
      </>
    )
    const meals = isOneDay
      ? [
          {
            label: '欠食する食事',
            value: getOneDayMealLabel(formValues.oneDayBreakfast, formValues.oneDayDinner),
          },
        ]
      : [
          {
            label: `開始日（${formatDateWithWeekday(formValues.startDate)}）の食事`,
            value: getMealLabel(formValues.start_meal),
          },
          {
            label: `終了日（${formatDateWithWeekday(formValues.endDate)}）の食事`,
            value: getMealLabel(formValues.end_meal),
          },
        ]
    return (
      <ConfirmAbsenceDialog
        title="入力内容の確認"
        periodLabel="欠食期間"
        periodValue={periodValue}
        meals={meals}
        reasonLabel="欠食理由"
        reasonValue={formValues.reason}
        onSubmit={() => onSubmit(formValues)}
        onBack={() => setIsConfirm(false)}
        isSubmitting={isSubmitting}
      />
    )
  }
  return null
}
