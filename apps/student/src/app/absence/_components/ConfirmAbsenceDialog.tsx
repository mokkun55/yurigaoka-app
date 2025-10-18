import React from 'react'
import InputLabel from '@/_components/ui/input-label'
import { Button } from '@/_components/ui/button'
import LoadingSpinner from '@/_components/ui/loading-spinner'
import Header from '@/_components/ui/header'

export type ConfirmAbsenceDialogProps = {
  title: string
  periodLabel: string
  periodValue: React.ReactNode
  meals: Array<{ label: string; value: string }>
  reasonLabel: string
  reasonValue: string
  specialReasonLabel?: string
  specialReasonValue?: string
  extraItems?: React.ReactNode
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  submitLabel?: string
  backLabel?: string
}

const ConfirmAbsenceDialog: React.FC<ConfirmAbsenceDialogProps> = ({
  title,
  periodLabel,
  periodValue,
  meals,
  reasonLabel,
  reasonValue,
  specialReasonLabel,
  specialReasonValue,
  extraItems,
  onSubmit,
  onBack,
  isSubmitting,
  submitLabel = 'この内容で提出する',
  backLabel = '内容を修正する',
}) => {
  return (
    <div className="bg-white h-full w-full max-w-screen overflow-x-hidden">
      <Header title={title} type="back" />
      <div className="p-3 gap-4 flex flex-col">
        <div className="text-center bg-(--red) rounded-lg px-4 py-3 text-white font-bold text-lg">
          <p>本当に以下の内容で大丈夫ですか？</p>
          <p>しっかり確認してください！！</p>
        </div>
        <InputLabel label={periodLabel}>
          <div className="text-base font-bold">{periodValue}</div>
        </InputLabel>
        {meals.map((meal, i) => (
          <InputLabel key={i} label={meal.label}>
            <div>{meal.value}</div>
          </InputLabel>
        ))}
        <InputLabel label={reasonLabel}>
          <div className="text-base text-(--main-text)">{reasonValue}</div>
        </InputLabel>
        {specialReasonLabel && specialReasonValue && (
          <InputLabel label={specialReasonLabel}>
            <div className="text-base">{specialReasonValue}</div>
          </InputLabel>
        )}
        {extraItems}
        <div className="text-center text-xl text-black font-extrabold">
          <p>上記の内容で問題がなければ、</p>
          <p>下の「{submitLabel}」を押してください</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="w-full font-bold" type="submit" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? (
              <>
                <LoadingSpinner /> 提出中...
              </>
            ) : (
              submitLabel
            )}
          </Button>
          <Button className="w-full font-bold" type="button" variant="destructive" onClick={onBack}>
            {backLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmAbsenceDialog
